# Stripe Checkout deployment

The Vite SPA remains a static frontend. Vercel discovers the Node functions in
`api/`; Neon Postgres stores authoritative application eligibility, payment
records, and Stripe webhook event IDs. Browser localStorage is not read by the
payment API and is never proof of payment.

## Vercel and Neon setup

1. Connect the repository to Vercel. `vercel.json` builds the Vite app into
   `dist/` and keeps SPA routes on `index.html`; `/api/*` is handled by Vercel
   Functions.
2. Create a Neon PostgreSQL database and add its pooled connection string as
   `DATABASE_URL` in Vercel. Run `db/migrations/0001_stripe_payments.sql` once
   against that database. The migration seeds the existing ₹1,50,000 fees in
   paise (15,000,000) for fellowship IDs `fel-1` through `fel-13`.
3. Applications must be provisioned in the `applications` table from an
   authenticated, trusted application-submission workflow. The current
   application form only writes to localStorage; it does not create server
   records, so those demo submissions cannot create Checkout Sessions.
4. Configure each environment variable below in the Vercel project settings.
   Set `APP_BASE_URL` to the exact HTTPS origin of the deployed SPA.
5. Configure a Stripe webhook destination at
   `https://<your-deployment-domain>/api/stripe/webhook` and subscribe to the
   events listed below. Copy its signing secret to Vercel; do not use the
   Stripe API secret as the webhook secret.

## Vercel environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled PostgreSQL connection string; server-only |
| `STRIPE_SECRET_KEY` | Stripe restricted/secret API key; server-only |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the deployed Stripe webhook endpoint; server-only |
| `APP_BASE_URL` | Canonical SPA origin used for Stripe success/cancel URLs |
| `FIREBASE_PROJECT_ID` | Firebase project ID used to verify ID tokens |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin service-account client email |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin service-account private key; preserve newlines or encode them as `\\n` |

No Stripe publishable key is required: Checkout is hosted by Stripe and the
frontend only navigates to the Checkout URL returned by the server. Never add
server secrets to `VITE_*` variables.

## API behavior

- `POST /api/stripe/create-checkout-session` accepts only `applicationId`.
  It requires a Firebase ID token, verifies application ownership and status
  (`Submitted`, `Approved`, `Payment Pending`, or `Enrolled`), reads the amount
  from `fellowship_programs`, and refuses an application with a paid payment.
  It creates/reuses a pending payment record and returns the Stripe-hosted URL.
- `POST /api/stripe/webhook` verifies the Stripe signature over the raw request
  body, checks session metadata/amount/currency against the database, and
  records the payment and event transactionally. Duplicate event IDs are
  ignored. The application review status is not changed by a payment event.
- `GET /api/payment/status?applicationId=...` requires the same Firebase ID
  token and returns the server-side application/payment status for that
  applicant. The Checkout return URL only triggers a status refresh; it is not
  evidence of payment.

Handled events: `checkout.session.completed`,
`checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, and `checkout.session.expired`.
Only a verified session with `payment_status=paid` can set a payment to `paid`.
Card data is collected only on Stripe-hosted Checkout and is not stored here.

## Authentication and migration limitations

The current `AuthContext` is demo/localStorage authentication. The functions
do not accept its applicant ID or trust application/payment localStorage. They
require a Firebase ID token and match its verified UID to
`applications.applicant_uid`. The existing Firebase sign-in is currently used
for Google Drive, not as the fellowship account system. Production rollout
must integrate a real applicant sign-in and securely provision/migrate
application IDs and verified Firebase UIDs before payment can succeed. Never
populate ownership from a browser-supplied UID.

The functions use Node transactions with Neon; local Vite alone does not serve
`api/`. Use `vercel dev` with these server environment variables for local
end-to-end testing. Stripe webhook verification and database behavior must be
tested against a configured Stripe test account and Neon database before
production use.
