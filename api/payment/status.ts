import type { IncomingMessage, ServerResponse } from 'node:http';
import { requireApplicantUid } from '../../server/payment/auth';
import { getDatabasePool } from '../../server/payment/db';
import { ApiError, handleApiError, methodNotAllowed, sendJson } from '../../server/payment/http';

interface PaymentStatusRow {
  application_status: string;
  fellowship_name: string;
  fee_amount_minor: string | number;
  fee_currency: string;
  payment_status: string | null;
  amount_minor: string | number | null;
  currency: string | null;
  updated_at: Date | null;
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> {
  if (request.method !== 'GET') {
    methodNotAllowed(response, ['GET']);
    return;
  }

  try {
    const applicantUid = await requireApplicantUid(request);
    const requestUrl = new URL(request.url || '/', 'http://localhost');
    const applicationId = requestUrl.searchParams.get('applicationId');
    if (!applicationId || applicationId.length > 100) {
      throw new ApiError(400, 'A valid applicationId is required.');
    }

    const result = await getDatabasePool().query<PaymentStatusRow>(
      `SELECT a.status AS application_status, fp.name AS fellowship_name,
              fp.amount_minor AS fee_amount_minor, fp.currency AS fee_currency,
              p.payment_status,
              p.amount_minor, p.currency, p.updated_at
       FROM applications a
       JOIN fellowship_programs fp ON fp.id = a.fellowship_id AND fp.active = TRUE
       LEFT JOIN LATERAL (
         SELECT payment_status, amount_minor, currency, updated_at
         FROM payments
         WHERE application_id = a.id
         ORDER BY (payment_status = 'paid') DESC, created_at DESC
         LIMIT 1
       ) p ON TRUE
       WHERE a.id = $1 AND a.applicant_uid = $2`,
      [applicationId, applicantUid]
    );
    const payment = result.rows[0];
    if (!payment) {
      throw new ApiError(404, 'No application was found for this signed-in applicant.');
    }

    sendJson(response, 200, {
      applicationStatus: payment.application_status,
      fellowshipName: payment.fellowship_name,
      feeAmountMinor: Number(payment.fee_amount_minor),
      feeCurrency: payment.fee_currency,
      paymentStatus: payment.payment_status ?? 'unpaid',
      amountMinor: payment.amount_minor === null ? null : Number(payment.amount_minor),
      currency: payment.currency,
      updatedAt: payment.updated_at
    });
  } catch (error) {
    handleApiError(response, error);
  }
}
