/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bố cục Web-Portal PC, cấp link tải file cài đặt EXE/DMG đã ký số
 */
import React from 'react';

export function DesktopPortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-7xl mx-auto">
      <header className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">HendyAppStore Desktop Portal</h1>
          <p className="text-xs text-slate-400">Authenticated Binaries for Windows 11/10 & macOS</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
          SmartScreen Green Status
        </span>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
