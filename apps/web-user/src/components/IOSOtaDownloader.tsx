/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tự động sinh file manifest.plist động để Safari cài app trực tiếp qua giao thức itms-services
 */
import React, { useState } from 'react';

interface Props {
  ipaUrl: string;
  bundleId: string;
  appName: string;
  version: string;
}

export const IOSOtaDownloader: React.FC<Props> = ({ ipaUrl, bundleId, appName, version }) => {
  const [installing, setInstalling] = useState(false);
  const manifestEndpoint = `/api/manifest.plist?url=${encodeURIComponent(ipaUrl)}&id=${encodeURIComponent(bundleId)}&v=${encodeURIComponent(version)}&name=${encodeURIComponent(appName)}`;
  const itmsUrl = `itms-services://?action=download-manifest&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + manifestEndpoint : manifestEndpoint)}`;

  const handleInstall = () => {
    setInstalling(true);
    if (typeof window !== 'undefined') {
      window.location.href = itmsUrl;
    }
    setTimeout(() => setInstalling(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-mono tracking-widest text-sky-400">Apple OTA Enterprise Protocol</span>
        <span className="px-2 py-0.5 text-[10px] rounded-full bg-sky-500/20 text-sky-300 font-medium">Safari Direct Sync</span>
      </div>
      <p className="text-sm text-slate-300 mb-4">
        Cài đặt trực tiếp trên iPhone/iPad không qua App Store thông qua chứng thư doanh nghiệp đã ký số.
      </p>
      <button
        onClick={handleInstall}
        className="w-full py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition active:scale-95"
      >
        {installing ? 'Đang gửi yêu cầu cài đặt tới iOS...' : 'Cài đặt iOS Trực tiếp (OTA .plist)'}
      </button>
    </div>
  );
};
export default IOSOtaDownloader;
