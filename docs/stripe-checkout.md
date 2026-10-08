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
3. Apply `db/migrations/0002_application_provisioning.sql` after migration
   `0001`. It adds the server-stored submission payload and a unique
   applicant/fellowship index. Check for duplicate `(applicant_uid,
   fellowship_id)` rows first; resolve any existing duplicates without deleting
   the records before creating that unique index.
4. After migration `0002`, inspect the target database for pre-existing
   `users` or `profiles` tables before applying
   `db/migrations/0003_user_profiles.sql`. The migration is additive and
   creates Firebase-UID-keyed user and applicant-profile records; it does not
   alter or delete existing rows. Registration saves the submitted profile
   through the authenticated `/api/profile` route; signed-in profile edits are
   saved through the same route. Do not deploy the registration/profile flow
   until this migration has been applied.
5. Configure Firebase Authentication with Google sign-in enabled and add the
   deployed Vercel domain to its authorized domains. Set all six browser-side
   `VITE_FIREBASE_*` variables from the same Firebase Web App and the
   server-side Firebase Admin credentials below. No checked-in Firebase
   fallback is used: Vite production builds fail with the names of any missing
   browser configuration variables rather than mixing projects.
   `VITE_FIREBASE_PROJECT_ID` and `FIREBASE_PROJECT_ID` must refer to the same
   Firebase project. Email/password and Google sign-in use the shared Firebase
   Auth instance; demo personas are available only during local development.
6. Authenticated applicants submit through `POST /api/applications`. The API
   verifies the Firebase ID token, derives the UID from its verified claims,
   validates the active fellowship, assigns an ID and `Submitted` status, and
   saves the form payload in Neon. A database unique index makes repeated
   submissions for the same applicant and fellowship idempotent: the existing
   application is returned without changing its details/status.
7. The Apply page caches the API response for rendering, but localStorage is
   not authoritative. `GET /api/applications` returns only records belonging
   to the verified Firebase UID. Checkout then checks that Neon record's
   application ID and UID before creating a Stripe session.
8. Reviewers use `GET /api/admin/applications` and
   `PATCH /api/admin/application-status`. Both require a Firebase ID token
   with the server-issued `admin: true` custom claim. Assign that claim only
   through a trusted Firebase Admin SDK environment, never from browser code.
   The API disallows browser/admin status changes to `Paid`; the Stripe
   webhook remains authoritative for payment. `Enrolled` is allowed only when
   Neon already contains a verified paid payment.
9. Configure each server environment variable below in Vercel. Set
   `APP_BASE_URL` to the exact HTTPS origin of the deployed SPA.
10. Configure a Stripe webhook destination at
   `https://<your-deployment-domain>/api/stripe/webhook` and subscribe to the
   events listed below. Copy its signing secret to Vercel; do not use the
   Stripe API secret as the webhook secret.

## Vercel environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase Web SDK project configuration |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Web SDK project configuration |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Web SDK project ID; must match the server Firebase project |
| `VITE_FIREBASE_APP_ID` | Firebase Web SDK project configuration |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Web SDK project configuration |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Web SDK project configuration |
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

- `POST /api/applications` requires Firebase sign-in, validates the fellowship
  against the active server-side program catalog, rejects browser-supplied
  identity/status fields, generates the application ID,
  stores validated form fields as `submission_data`, and sets status to
  `Submitted`. Repeating a submission for the same UID/fellowship returns the
  existing record unchanged.
- `GET /api/applications` returns only applications where
  `applicant_uid =` the UID from the verified Firebase token.
- `GET /api/admin/applications` requires the Firebase custom claim
  `admin: true` and returns the admissions queue.
- `PATCH /api/admin/application-status` requires the same admin claim and
  accepts only review statuses. It cannot mark an application `Paid`;
  enrollment requires a matching paid payment record.
- `POST /api/stripe/create-checkout-session` accepts only `applicationId`.
  It requires a Firebase ID token, verifies application ownership and status
  (`Submitted` or `Approved` only), reads the amount
  from `fellowship_programs`, and refuses an application with a paid payment.
  It creates/reuses a pending payment record only while the application remains
  in one of those eligible statuses, then returns the Stripe-hosted URL.
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

The existing `AuthContext` login/register remains demo/localStorage
authentication. Apply uses Firebase Google sign-in from the shared Firebase
Web SDK instance. The server verifies ID tokens with revocation checking;
ownership is always bound to the token's UID, never the demo user ID, browser
UID, email, or localStorage. Configure Google as a Firebase Authentication
provider and authorize the production domain. Firebase Web configuration is
required in Vercel at build time; Firebase Admin credentials are server-only.
Application documents are currently stored as filenames in the application
payload; file contents are not uploaded by this API.

The functions use Node transactions with Neon; local Vite alone does not serve
`api/`. Use `vercel dev` with these server environment variables for local
end-to-end testing. Stripe webhook verification and database behavior must be
tested against a configured Stripe test account and Neon database before
production use.
