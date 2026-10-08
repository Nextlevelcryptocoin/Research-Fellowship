import type { IncomingMessage, ServerResponse } from 'node:http';
import { requireAdminUid } from '../../server/payment/auth';
import { withTransaction } from '../../server/payment/db';
import { ApiError, handleApiError, methodNotAllowed, sendJson } from '../../server/payment/http';

const ADMIN_REVIEW_STATUSES = new Set([
  'Submitted',
  'Under Review',
  'Additional Information Required',
  'Approved',
  'Rejected',
  'Withdrawn',
  'Enrolled'
]);

export default async function handler(
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse
): Promise<void> {
  if (request.method !== 'PATCH') {
    methodNotAllowed(response, ['PATCH']);
    return;
  }

  try {
    await requireAdminUid(request);
    const body =
      typeof request.body === 'object' && request.body !== null && !Array.isArray(request.body)
        ? request.body as Record<string, unknown>
        : {};
    if (
      typeof body.applicationId !== 'string' ||
      body.applicationId.length < 1 ||
      body.applicationId.length > 100
    ) {
      throw new ApiError(400, 'A valid applicationId is required.');
    }
    if (typeof body.status !== 'string' || !ADMIN_REVIEW_STATUSES.has(body.status)) {
      throw new ApiError(400, 'The requested application review status is not allowed.');
    }

    const updated = await withTransaction(async (client) => {
      const application = await client.query(
        `SELECT id FROM applications
         WHERE id = $1
         FOR UPDATE`,
        [body.applicationId]
      );
      if (!application.rowCount) throw new ApiError(404, 'Application not found.');

      if (body.status === 'Enrolled') {
        const paidPayment = await client.query(
          `SELECT id FROM payments
           WHERE application_id = $1 AND payment_status = 'paid'
           LIMIT 1
           FOR UPDATE`,
          [body.applicationId]
        );
        if (!paidPayment.rowCount) {
          throw new ApiError(409, 'An application cannot be enrolled before its payment is verified.');
        }
      }

      const result = await client.query<{ id: string; status: string; updated_at: Date }>(
        `UPDATE applications
         SET status = $2, updated_at = NOW()
         WHERE id = $1
         RETURNING id, status, updated_at`,
        [body.applicationId, body.status]
      );
      return result.rows[0];
    });

    sendJson(response, 200, {
      applicationId: updated.id,
      status: updated.status,
      updatedAt: updated.updated_at
    });
  } catch (error) {
    handleApiError(response, error);
  }
}
