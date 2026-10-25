/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Giao diện di động: Phê duyệt nhanh biến, kiểm tra logs từ xa
 */
import React from 'react';

export function MobileCMSPocketLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 max-w-md mx-auto">
      <header className="mb-4 flex items-center justify-between border-b border-purple-800/40 pb-3">
        <h1 className="font-extrabold text-purple-400 text-base">Hendy Admin Pocket CMS</h1>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Edge Remote</span>
      </header>
      <main className="space-y-4">{children}</main>
    </div>
  );
}
