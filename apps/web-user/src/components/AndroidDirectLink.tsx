/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Phân phối file APK V2 tối ưu ProGuard vượt rào Knox/PlayProtect
 */
import React from 'react';

interface Props {
  apkUrl: string;
  sha256: string;
  version: string;
  fileSize: string;
}

export const AndroidDirectLink: React.FC<Props> = ({ apkUrl, sha256, version, fileSize }) => {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">Android V2/V3 Signature</span>
        <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300">Play Protect & Knox Clean</span>
      </div>
      <div className="text-xs font-mono text-slate-400 mb-3 break-all">
        SHA-256 Checksum: <span className="text-emerald-300">{sha256}</span>
      </div>
      <a
        href={apkUrl}
        download
        className="block text-center w-full py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition active:scale-95"
      >
        Tải APK Sạch v{version} ({fileSize})
      </a>
    </div>
  );
};
export default AndroidDirectLink;
