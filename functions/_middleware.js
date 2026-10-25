/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cloudflare Pages Edge Middleware kiểm soát bảo mật và điều hướng request
 */
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Security Headers
  const response = await next();
  const headers = new Headers(response.headers);

  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
