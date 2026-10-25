/**
 * Cloudflare Worker: Edge Router Engine
 * Nhận diện User-Agent để nạp Layout động ngay tại mạng biên Cloudflare
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const ua = request.headers.get('user-agent') || '';

    // 1. Phân luồng theo Hostname
    if (hostname.startsWith('admin.') || url.pathname.startsWith('/admin')) {
      return fetch(new Request(`https://hendy-store-admin.pages.dev${url.pathname}${url.search}`, request));
    }

    // 2. Dynamic Manifest.plist endpoint cho iOS OTA
    if (url.pathname === '/api/manifest.plist') {
      const ipaUrl = url.searchParams.get('url') || 'https://r2.hendyappstore.com/apps/hendy.ipa';
      const bundleId = url.searchParams.get('id') || 'com.hendy.superapp';
      const version = url.searchParams.get('v') || '2.5.4';
      const title = url.searchParams.get('name') || 'Hendy SuperApp';

      const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${ipaUrl}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${bundleId}</string>
        <key>bundle-version</key>
        <string>${version}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${title}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`;

      return new Response(plist, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // 3. Phân luồng mặc định tới Web-User Pages
    return fetch(new Request(`https://hendy-store-user.pages.dev${url.pathname}${url.search}`, request));
  },
};
