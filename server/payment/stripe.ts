import Stripe from 'stripe';
import { env } from 'node:process';
import { ApiError } from './http';

let stripe: Stripe | undefined;

export function getStripe(): Stripe {
  const secretKey = env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new ApiError(503, 'Stripe is not configured.');
  }

  stripe ??= new Stripe(secretKey);
  return stripe;
}

export function getWebhookSecret(): string {
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new ApiError(503, 'Stripe webhook verification is not configured.');
  }
  return secret;
}

export function getApplicationBaseUrl(): string {
  const configuredUrl = env.APP_BASE_URL;
  if (!configuredUrl) {
    throw new ApiError(503, 'The application base URL is not configured.');
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new ApiError(503, 'The application base URL is invalid.');
  }
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new ApiError(503, 'The application base URL must use HTTPS.');
  }
  return url.origin;
}
