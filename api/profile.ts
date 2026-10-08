import type { ServerResponse } from 'node:http';
import { requireApplicantIdentity } from '../server/payment/auth';
import { getDatabasePool, withTransaction } from '../server/payment/db';
import {
  ApiError,
  handleApiError,
  methodNotAllowed,
  sendJson,
  type ApiRequest
} from '../server/payment/http';
import {
  parseApplicantProfile,
  parseApplicantProfilePatch,
  toApplicantProfile,
  getProfileColumnName,
  type ApplicantProfileInput,
  type ApplicantProfileRow
} from '../server/payment/profiles';

export default async function handler(
  request: ApiRequest,
  response: ServerResponse
): Promise<void> {
  try {
    const identity = await requireApplicantIdentity(request);

    if (request.method === 'GET') {
      const result = await getDatabasePool().query<ApplicantProfileRow>(
        `SELECT p.first_name, p.last_name, p.mobile_number, p.country,
                p.state_province, p.date_of_birth, p.gender,
                p.highest_qualification, p.institution, p.current_occupation,
                p.research_interest, u.email, u.email_verified,
                p.created_at, p.updated_at
         FROM profiles p
         JOIN users u ON u.firebase_uid = p.firebase_uid
         WHERE p.firebase_uid = $1`,
        [identity.uid]
      );
      sendJson(response, 200, {
        profile: result.rows[0] ? toApplicantProfile(result.rows[0]) : null
      });
      return;
    }

    if (request.method !== 'PUT' && request.method !== 'PATCH') {
      methodNotAllowed(response, ['GET', 'PUT', 'PATCH']);
      return;
    }

    if (!identity.email) {
      throw new ApiError(400, 'The signed-in Firebase account must have an email address.');
    }
    const profile =
      request.method === 'PUT'
        ? parseApplicantProfile(request.body)
        : parseApplicantProfilePatch(request.body);

    const saved = await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO users (firebase_uid, email, email_verified)
         VALUES ($1, $2, $3)
         ON CONFLICT (firebase_uid) DO UPDATE
         SET email = EXCLUDED.email,
             email_verified = EXCLUDED.email_verified,
             updated_at = NOW()`,
        [identity.uid, identity.email, identity.emailVerified]
      );

      const fields = Object.keys(profile) as (keyof ApplicantProfileInput)[];
      const columns = fields.map(getProfileColumnName);
      const values = fields.map((field) => {
        const value = profile[field];
        return field === 'dateOfBirth' && value === '' ? null : value;
      });
      const insertColumns = ['firebase_uid', ...columns];
      const insertValues = [identity.uid, ...values];
      const placeholders = fields.map((field, index) =>
        field === 'dateOfBirth' ? `$${index + 2}::date` : `$${index + 2}`
      );
      const updates = columns.map(
        (column) => `${column} = EXCLUDED.${column}`
      );
      updates.push('updated_at = NOW()');

      const result = await client.query<ApplicantProfileRow>(
        `INSERT INTO profiles (${insertColumns.join(', ')})
         VALUES ($1, ${placeholders.join(', ')})
         ON CONFLICT (firebase_uid) DO UPDATE
         SET ${updates.join(', ')}
         RETURNING first_name, last_name, mobile_number, country,
                   state_province, date_of_birth, gender, highest_qualification,
                   institution, current_occupation, research_interest,
                   created_at, updated_at`,
        insertValues
      );
      return result.rows[0];
    });

    sendJson(response, 200, {
      profile: {
        ...toApplicantProfile({
          ...saved,
          email: identity.email,
          email_verified: identity.emailVerified
        })
      }
    });
  } catch (error) {
    handleApiError(response, error);
  }
}
