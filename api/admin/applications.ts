import type { IncomingMessage, ServerResponse } from 'node:http';
import { requireAdminUid } from '../../server/payment/auth.js';
import { getDatabasePool } from '../../server/payment/db.js';
import { handleApiError, methodNotAllowed, sendJson } from '../../server/payment/http.js';
import {
  toApplicationRecord,
  type ApplicationRow
} from '../../server/payment/applications.js';

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> {
  if (request.method !== 'GET') {
    methodNotAllowed(response, ['GET']);
    return;
  }

  try {
    await requireAdminUid(request);
    const result = await getDatabasePool().query<ApplicationRow>(
      `SELECT a.id, a.applicant_uid, a.fellowship_id, fp.name AS fellowship_name,
              a.status, a.submission_data, a.created_at, a.updated_at
       FROM applications a
       JOIN fellowship_programs fp ON fp.id = a.fellowship_id
       ORDER BY a.created_at DESC`
    );
    sendJson(response, 200, {
      applications: result.rows.map(toApplicationRecord)
    });
  } catch (error) {
    handleApiError(response, error);
  }
}
