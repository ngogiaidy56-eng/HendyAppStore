/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Điều phối và phân luồng cấu trúc giao diện Web-Admin
 */
import React, { useState } from 'react';
import { useDeviceDetect } from './hooks/useDeviceDetect.js';
import { MobileCMSPocketLayout } from './layouts/MobileCMSPocketLayout.js';
import { FullDevStudioLayout } from './layouts/FullDevStudioLayout.js';
import { AutomationSecretsForm } from './components/AutomationSecretsForm.tsx';
import { CertUploadSecure } from './components/CertUploadSecure.tsx';

export default function App() {
  const device = useDeviceDetect();
  const [synced, setSynced] = useState(false);

  const content = (
    <div className="space-y-6">
      <AutomationSecretsForm
        secrets={[{ key: 'ANDROID_KEYSTORE_BASE64' }, { key: 'IOS_CERTIFICATE_P12_BASE64' }]}
        onSync={() => setSynced(true)}
      />
      <CertUploadSecure onEncoded={(b64, name) => console.log('Encoded:', name)} />
      {synced && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
          Đã đồng bộ 26 biến sang GitHub Actions Secrets & Vars thành công!
        </div>
      )}
    </div>
  );

  if (device.isMobile) {
    return <MobileCMSPocketLayout>{content}</MobileCMSPocketLayout>;
  }

  return <FullDevStudioLayout>{content}</FullDevStudioLayout>;
}
