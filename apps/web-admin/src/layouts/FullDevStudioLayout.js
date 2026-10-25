/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Giao diện máy tính: Không gian quản lý biến chi tiết, nạp chứng chỉ
 */
import React from 'react';

export function FullDevStudioLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-7xl mx-auto">
      <header className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">HendyAppStore Dev Studio</h1>
          <p className="text-xs text-slate-400">Automated Environment Matrix Pipeline & Secrets Management</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
          GitHub Actions API Connected
        </span>
      </header>
      <main>{children}</main>
    </div>
  );
}
