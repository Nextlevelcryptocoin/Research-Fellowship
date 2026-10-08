import type { IncomingMessage, ServerResponse } from 'node:http';
import { Buffer } from 'node:buffer';

export type ApiRequest = IncomingMessage & {
  body?: unknown;
};

export type ApiResponse = ServerResponse;

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function sendJson(
  response: ApiResponse,
  statusCode: number,
  body: Record<string, unknown>
): void {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

export function methodNotAllowed(response: ApiResponse, allowed: string[]): void {
  response.setHeader('Allow', allowed.join(', '));
  sendJson(response, 405, { error: 'Method not allowed.' });
}

export function handleApiError(response: ApiResponse, error: unknown): void {
  if (error instanceof ApiError) {
    sendJson(response, error.statusCode, { error: error.message });
    return;
  }

  console.error('Payment API request failed.', error);
  sendJson(response, 500, { error: 'The request could not be completed.' });
}

export function getBearerToken(request: ApiRequest): string {
  const authorization = request.headers.authorization;
  const match = authorization?.match(/^Bearer ([^\s]+)$/);
  if (!match) {
    throw new ApiError(401, 'A valid Firebase sign-in is required for payment.');
  }
  return match[1];
}

export async function readRawBody(request: ApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
