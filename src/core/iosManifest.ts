/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ManifestOptions {
  ipaUrl: string;
  bundleId: string;
  bundleVersion: string;
  title: string;
  icon512Url?: string;
  icon57Url?: string;
}

/**
 * Generates an Apple Enterprise/Ad-Hoc OTA manifest.plist XML string.
 * This XML allows iOS Safari to trigger direct in-app installation without App Store rejection.
 */
export function generateIosManifestXml(opts: ManifestOptions): string {
  const icon512 = opts.icon512Url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&auto=format&fit=crop&q=80';
  const icon57 = opts.icon57Url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=57&auto=format&fit=crop&q=80';

  return `<?xml version="1.0" encoding="UTF-8"?>
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
          <string>${opts.ipaUrl}</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>full-size-image</string>
          <key>needs-shine</key>
          <true/>
          <key>url</key>
          <string>${icon512}</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>display-image</string>
          <key>needs-shine</key>
          <true/>
          <key>url</key>
          <string>${icon57}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${opts.bundleId}</string>
        <key>bundle-version</key>
        <string>${opts.bundleVersion}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${opts.title}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`.trim();
}

/**
 * Encodes manifest URL into the standard Apple itms-services scheme.
 */
export function buildItmsServicesUrl(manifestUrl: string): string {
  return `itms-services://?action=download-manifest&url=${encodeURIComponent(manifestUrl)}`;
}
