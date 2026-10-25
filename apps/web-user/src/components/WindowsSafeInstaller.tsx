/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Phân phối bộ cài EXE vượt rào kiểm duyệt Windows SmartScreen
 */
import React from 'react';

interface Props {
  exeUrl: string;
  version: string;
  fileSize: string;
  publisher: string;
}

export const WindowsSafeInstaller: React.FC<Props> = ({ exeUrl, version, fileSize, publisher }) => {
  return (
    <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-mono tracking-widest text-blue-400">Windows Authenticode EV/OV</span>
        <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-300">SmartScreen Green List</span>
      </div>
      <p className="text-xs text-slate-300 mb-2">Đơn vị phát hành: <strong className="text-white">{publisher}</strong></p>
      <a
        href={exeUrl}
        download
        className="block text-center w-full py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition active:scale-95"
      >
        Tải Bộ Cài Đặt Hendy-Setup.exe ({fileSize})
      </a>
    </div>
  );
};
export default WindowsSafeInstaller;
