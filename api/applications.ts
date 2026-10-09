import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { requireApplicantUid } from '../server/payment/auth.js';
import { getDatabasePool, withTransaction } from '../server/payment/db.js';
import {
  ApiError,
  handleApiError,
  methodNotAllowed,
  sendJson,
  type ApiRequest
} from '../server/payment/http.js';
import {
  parseApplicationSubmission,
  toApplicationRecord,
  type ApplicationRow
} from '../server/payment/applications.js';

export default async function handler(
  request: ApiRequest,
  response: ServerResponse
): Promise<void> {
  try {
    const applicantUid = await requireApplicantUid(request);

    if (request.method === 'GET') {
      const result = await getDatabasePool().query<ApplicationRow>(
        `SELECT a.id, a.applicant_uid, a.fellowship_id, fp.name AS fellowship_name,
                a.status, a.submission_data, a.created_at, a.updated_at
         FROM applications a
         JOIN fellowship_programs fp ON fp.id = a.fellowship_id
         WHERE a.applicant_uid = $1
         ORDER BY a.created_at DESC`,
        [applicantUid]
      );
      sendJson(response, 200, {
        applications: result.rows.map(toApplicationRecord)
      });
      return;
    }

    if (request.method !== 'POST') {
      methodNotAllowed(response, ['GET', 'POST']);
      return;
    }

    if (typeof request.body !== 'object' || request.body === null || Array.isArray(request.body)) {
      throw new ApiError(400, 'A JSON application submission is required.');
    }

    const { fellowshipId, submissionData } = parseApplicationSubmission(
      request.body as Record<string, unknown>
    );

    const application = await withTransaction(async (client) => {
      const programResult = await client.query<{ id: string; name: string }>(
        `SELECT id, name FROM fellowship_programs
         WHERE id = $1 AND active = TRUE`,
        [fellowshipId]
      );
      const program = programResult.rows[0];
      if (!program) {
        throw new ApiError(400, 'The selected fellowship is not available.');
      }

      const inserted = await client.query<ApplicationRow>(
        `INSERT INTO applications
           (id, applicant_uid, fellowship_id, status, submission_data)
         VALUES ($1, $2, $3, 'Submitted', $4::jsonb)
         ON CONFLICT (applicant_uid, fellowship_id) DO NOTHING
         RETURNING id, applicant_uid, fellowship_id, status,
                   submission_data, created_at, updated_at`,
        [randomUUID(), applicantUid, fellowshipId, JSON.stringify(submissionData)]
      );

      if (inserted.rowCount) {
        return { row: { ...inserted.rows[0], fellowship_name: program.name }, created: true };
      }

      const existing = await client.query<ApplicationRow>(
        `SELECT a.id, a.applicant_uid, a.fellowship_id, fp.name AS fellowship_name,
                a.status, a.submission_data, a.created_at, a.updated_at
         FROM applications a
         JOIN fellowship_programs fp ON fp.id = a.fellowship_id
         WHERE a.applicant_uid = $1 AND a.fellowship_id = $2
         FOR UPDATE OF a`,
        [applicantUid, fellowshipId]
      );
      const existingRow = existing.rows[0];
      if (!existingRow) {
        throw new ApiError(409, 'An application already exists for this fellowship. Refresh and try again.');
      }
      return { row: existingRow, created: false };
    });

    sendJson(response, application.created ? 201 : 200, {
      application: toApplicationRecord(application.row),
      created: application.created
    });
  } catch (error) {
    handleApiError(response, error);
  }
}
