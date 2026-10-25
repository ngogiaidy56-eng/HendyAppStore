/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Điều phối và phân luồng cấu trúc giao diện Web-User Core
 */
import React from 'react';
import { useDeviceDetect } from './hooks/useDeviceDetect.js';
import { MobileAppStoreLayout } from './layouts/MobileAppStoreLayout.js';
import { DesktopPortalLayout } from './layouts/DesktopPortalLayout.js';
import { IOSOtaDownloader } from './components/IOSOtaDownloader.tsx';
import { AndroidDirectLink } from './components/AndroidDirectLink.tsx';
import { WindowsSafeInstaller } from './components/WindowsSafeInstaller.tsx';

export default function App() {
  const device = useDeviceDetect();

  const appData = {
    name: 'Hendy SuperApp',
    version: '2.5.4',
    size: '42.8 MB',
    bundleId: 'com.hendy.superapp',
    apkUrl: 'https://r2.hendyappstore.com/binaries/android/HendySuperApp-v2.5.4-v2signed.apk',
    ipaUrl: 'https://r2.hendyappstore.com/binaries/ios/HendySuperApp-v2.5.4-enterprise.ipa',
    exeUrl: 'https://r2.hendyappstore.com/binaries/windows/HendySuperApp-Setup-x64.exe',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    publisher: 'Hendy Global Technology Ltd. (EV Code Signing)'
  };

  const content = (
    <div className="space-y-4">
      {device.isIOS && (
        <IOSOtaDownloader
          ipaUrl={appData.ipaUrl}
          bundleId={appData.bundleId}
          appName={appData.name}
          version={appData.version}
        />
      )}
      {device.isAndroid && (
        <AndroidDirectLink
          apkUrl={appData.apkUrl}
          sha256={appData.sha256}
          version={appData.version}
          fileSize={appData.size}
        />
      )}
      {!device.isMobile && (
        <WindowsSafeInstaller
          exeUrl={appData.exeUrl}
          version={appData.version}
          fileSize={appData.size}
          publisher={appData.publisher}
        />
      )}
    </div>
  );

  if (device.isMobile) {
    return <MobileAppStoreLayout>{content}</MobileAppStoreLayout>;
  }

  return <DesktopPortalLayout>{content}</DesktopPortalLayout>;
}
