/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cloudflare Pages Functions: Trả về trạng thái đồng bộ biến thời gian thực
 */
export async function onRequestGet(context) {
  const { env } = context;

  // Lấy dữ liệu nhật ký đồng bộ từ Cloudflare D1 Database
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM sync_audit_logs ORDER BY timestamp DESC LIMIT 50"
    ).all();

    return new Response(JSON.stringify({ success: true, logs: results }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
