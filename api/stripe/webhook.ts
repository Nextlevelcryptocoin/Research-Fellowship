import type { IncomingMessage, ServerResponse } from 'node:http';
import type Stripe from 'stripe';
import { getDatabasePool, withTransaction } from '../../server/payment/db';
import {
  ApiError,
  handleApiError,
  methodNotAllowed,
  readRawBody,
  sendJson
} from '../../server/payment/http';
import { getStripe, getWebhookSecret } from '../../server/payment/stripe';

export const config = { api: { bodyParser: false } };

const SUPPORTED_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired'
]);

function paymentStatusForEvent(event: Stripe.Event, session: Stripe.Checkout.Session) {
  if (event.type === 'checkout.session.expired') return 'expired';
  if (event.type === 'checkout.session.async_payment_failed') return 'failed';
  if (event.type === 'checkout.session.async_payment_succeeded') {
    if (session.payment_status !== 'paid') {
      throw new ApiError(400, 'Stripe reported async success without a paid Checkout Session.');
    }
    return 'paid';
  }
  return session.payment_status === 'paid' ? 'paid' : 'pending';
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> {
  if (request.method !== 'POST') {
    methodNotAllowed(response, ['POST']);
    return;
  }

  try {
    const signatureHeader = request.headers['stripe-signature'];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    if (!signature) throw new ApiError(400, 'Missing Stripe signature.');

    const stripe = getStripe();
    const webhookSecret = getWebhookSecret();
    const rawBody = await readRawBody(request);
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch {
      throw new ApiError(400, 'Stripe webhook signature verification failed.');
    }

    if (!SUPPORTED_EVENTS.has(event.type)) {
      await getDatabasePool().query(
        `INSERT INTO stripe_webhook_events
           (stripe_event_id, event_type, processed_status, processed_at)
         VALUES ($1, $2, 'ignored', NOW())
         ON CONFLICT (stripe_event_id) DO NOTHING`,
        [event.id, event.type]
      );
      sendJson(response, 200, { received: true, ignored: true });
      return;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;
    const amountTotal = session.amount_total;
    const sessionCurrency = session.currency;
    if (
      !metadata?.payment_id ||
      !metadata.application_id ||
      !metadata.applicant_uid ||
      amountTotal === null ||
      amountTotal === 0 ||
      !sessionCurrency ||
      session.mode !== 'payment' ||
      session.client_reference_id !== metadata.application_id
    ) {
      throw new ApiError(400, 'Stripe Checkout Session is missing required payment metadata.');
    }

    const nextStatus = paymentStatusForEvent(event, session);
    await withTransaction(async (client) => {
      const claim = await client.query<{ stripe_event_id: string }>(
        `INSERT INTO stripe_webhook_events (stripe_event_id, event_type, processed_status)
         VALUES ($1, $2, 'processing')
         ON CONFLICT (stripe_event_id) DO NOTHING
         RETURNING stripe_event_id`,
        [event.id, event.type]
      );

      if (!claim.rowCount) return;

      const applicationResult = await client.query(
        `SELECT id FROM applications
         WHERE id = $1 AND applicant_uid = $2
         FOR UPDATE`,
        [metadata.application_id, metadata.applicant_uid]
      );
      if (!applicationResult.rowCount) {
        throw new ApiError(404, 'No matching authenticated application exists.');
      }

      const paymentResult = await client.query<{
        id: string;
        amount_minor: string | number;
        currency: string;
      }>(
        `SELECT id, amount_minor, currency
         FROM payments
         WHERE id = $1 AND application_id = $2
         FOR UPDATE`,
        [metadata.payment_id, metadata.application_id]
      );
      const payment = paymentResult.rows[0];
      if (!payment) throw new ApiError(404, 'No matching payment record exists.');
      if (
        Number(payment.amount_minor) !== amountTotal ||
        payment.currency.toLowerCase() !== sessionCurrency.toLowerCase()
      ) {
        throw new ApiError(400, 'Stripe session amount or currency does not match the payment record.');
      }

      const existingSession = await client.query<{ stripe_checkout_session_id: string | null }>(
        `SELECT stripe_checkout_session_id FROM payments
         WHERE id = $1 AND stripe_checkout_session_id IS NOT NULL`,
        [payment.id]
      );
      const storedSessionId = existingSession.rows[0]?.stripe_checkout_session_id;
      if (storedSessionId && storedSessionId !== session.id) {
        throw new ApiError(400, 'Stripe Checkout Session does not match the payment record.');
      }

      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null;
      await client.query(
        `UPDATE payments
         SET stripe_checkout_session_id = $2,
             stripe_payment_intent_id = COALESCE($3, stripe_payment_intent_id),
             payment_status = CASE
               WHEN payment_status = 'paid' THEN 'paid'
               ELSE $4
             END,
             updated_at = NOW()
         WHERE id = $1`,
        [payment.id, session.id, paymentIntentId, nextStatus]
      );

      await client.query(
        `UPDATE stripe_webhook_events
         SET processed_status = 'processed', processed_at = NOW()
         WHERE stripe_event_id = $1`,
        [event.id]
      );
    });

    sendJson(response, 200, { received: true });
  } catch (error) {
    handleApiError(response, error);
  }
}
