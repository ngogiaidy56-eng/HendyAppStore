/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bố cục chợ App di động, tích hợp OTA itms-services cho iOS và V2 APK cho Android
 */
import React from 'react';

export function MobileAppStoreLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 max-w-md mx-auto">
      <header className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="font-extrabold text-indigo-400 text-lg">Hendy Mobile Store</div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">OTA Ready</span>
      </header>
      <main className="flex-1 space-y-4">
        {children}
      </main>
    </div>
  );
}
