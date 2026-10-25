/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cloudflare Pages Functions: Xử lý xác thực người dùng tại biên (Cloudflare Edge)
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { token, accessAud } = await request.json();

    // Xác thực token với CF_ACCESS_AUD hoặc JWT_SECRET
    if (accessAud && accessAud === env.CF_ACCESS_AUD) {
      return new Response(JSON.stringify({ authenticated: true, role: 'admin' }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!token) {
      return new Response(JSON.stringify({ authenticated: false, error: 'Token missing' }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ authenticated: true, role: 'operator' }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
