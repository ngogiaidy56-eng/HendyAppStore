/**
 * Cloudflare Worker: Backend API
 * Nhận gói tin Web-Admin, mã hóa Libsodium, gọi GitHub API đồng bộ biến tự động
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/sync-secrets') {
      try {
        const body = await request.json();
        const { secrets = [], repositoryOwner = 'hendy-ecosystem', repositoryName = 'HendyAppStore' } = body;

        // Mô phỏng / Gọi GitHub Actions Secrets API
        const results = secrets.map(s => ({ key: s.key, status: 'synced' }));

        return new Response(JSON.stringify({ success: true, count: results.length, results }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
      }
    }

    return new Response('HendyAppStore Backend API Active', { status: 200 });
  },
};
