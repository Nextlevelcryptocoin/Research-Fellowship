import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { requireApplicantUid } from '../../server/payment/auth.js';
import { withTransaction } from '../../server/payment/db.js';
import { ApiError, handleApiError, methodNotAllowed, sendJson } from '../../server/payment/http.js';
import { getApplicationBaseUrl, getStripe } from '../../server/payment/stripe.js';

const PAYMENT_ELIGIBLE_STATUSES = ['Submitted', 'Approved'];

interface ApplicationPaymentRow {
  id: string;
  status: string;
  fellowship_id: string;
  fellowship_name: string;
  amount_minor: string | number;
  currency: string;
}

interface PaymentRow {
  id: string;
  stripe_checkout_session_id: string | null;
  amount_minor: string | number;
  currency: string;
}

export default async function handler(
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse
): Promise<void> {
  if (request.method !== 'POST') {
    methodNotAllowed(response, ['POST']);
    return;
  }

  try {
    const applicantUid = await requireApplicantUid(request);
    const body =
      typeof request.body === 'object' && request.body !== null
        ? (request.body as Record<string, unknown>)
        : {};
    const applicationId = body.applicationId;
    if (
      typeof applicationId !== 'string' ||
      applicationId.length < 1 ||
      applicationId.length > 100
    ) {
      throw new ApiError(400, 'A valid applicationId is required.');
    }

    const reservation = await withTransaction(async (client) => {
      const applicationResult = await client.query<ApplicationPaymentRow>(
        `SELECT a.id, a.status, a.fellowship_id, fp.name AS fellowship_name,
                fp.amount_minor, fp.currency
         FROM applications a
         JOIN fellowship_programs fp ON fp.id = a.fellowship_id AND fp.active = TRUE
         WHERE a.id = $1 AND a.applicant_uid = $2
         FOR UPDATE OF a`,
        [applicationId, applicantUid]
      );
      const application = applicationResult.rows[0];
      if (!application) {
        throw new ApiError(404, 'No application was found for this signed-in applicant.');
      }
      if (!PAYMENT_ELIGIBLE_STATUSES.includes(application.status)) {
        throw new ApiError(403, 'This application is not eligible for fellowship fee payment.');
      }

      const paidResult = await client.query(
        `SELECT id FROM payments
         WHERE application_id = $1 AND payment_status = 'paid'
         LIMIT 1`,
        [application.id]
      );
      if (paidResult.rowCount) {
        throw new ApiError(409, 'The fellowship fee has already been paid.');
      }

      let paymentResult = await client.query<PaymentRow>(
        `SELECT id, stripe_checkout_session_id, amount_minor, currency
         FROM payments
         WHERE application_id = $1 AND payment_status = 'pending'
         ORDER BY created_at DESC
         LIMIT 1
         FOR UPDATE`,
        [application.id]
      );

      if (!paymentResult.rowCount) {
        paymentResult = await client.query<PaymentRow>(
          `INSERT INTO payments
             (id, application_id, amount_minor, currency, payment_status)
           VALUES ($1, $2, $3, $4, 'pending')
           RETURNING id, stripe_checkout_session_id, amount_minor, currency`,
          [
            randomUUID(),
            application.id,
            application.amount_minor,
            application.currency
          ]
        );
      }

      return { application, payment: paymentResult.rows[0] };
    });

    const stripe = getStripe();
    if (reservation.payment.stripe_checkout_session_id) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        reservation.payment.stripe_checkout_session_id
      );
      if (existingSession.status === 'open' && existingSession.url) {
        sendJson(response, 200, { url: existingSession.url });
        return;
      }
      if (existingSession.status === 'complete') {
        sendJson(response, 409, {
          error: 'Checkout is complete. Payment confirmation is being processed.'
        });
        return;
      }
      await withTransaction(async (client) => {
        await client.query(
          `UPDATE payments
           SET payment_status = 'expired', updated_at = NOW()
           WHERE id = $1 AND payment_status = 'pending'`,
          [reservation.payment.id]
        );
      });

      throw new ApiError(
        409,
        'The previous Checkout Session expired. Refresh payment status before trying again.'
      );
    }

    const baseUrl = getApplicationBaseUrl();
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: reservation.payment.currency.toLowerCase(),
              product_data: { name: reservation.application.fellowship_name },
              unit_amount: Number(reservation.payment.amount_minor)
            },
            quantity: 1
          }
        ],
        client_reference_id: reservation.application.id,
        metadata: {
          payment_id: reservation.payment.id,
          application_id: reservation.application.id,
          applicant_uid: applicantUid
        },
        success_url: `${baseUrl}/checkout?payment=return`,
        cancel_url: `${baseUrl}/checkout?payment=cancelled`
      },
      { idempotencyKey: `fellowship-payment-${reservation.payment.id}` }
    );

    if (!session.url) {
      throw new ApiError(502, 'Stripe did not provide a Checkout URL.');
    }

    await withTransaction(async (client) => {
      await client.query(
        `UPDATE payments
         SET stripe_checkout_session_id = $2, updated_at = NOW()
         WHERE id = $1 AND payment_status = 'pending'`,
        [reservation.payment.id, session.id]
      );
    });

    sendJson(response, 200, { url: session.url });
  } catch (error) {
    handleApiError(response, error);
  }
}
