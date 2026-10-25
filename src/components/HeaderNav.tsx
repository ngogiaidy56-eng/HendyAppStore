/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Smartphone,
  Monitor,
  Shield,
  Layers,
  Code2,
  Bot,
  Zap,
  Globe,
  Radio,
  CheckCircle2,
  Laptop,
} from 'lucide-react';
import { DeviceType } from '../core/types';

export type AppViewMode = 'web-user' | 'web-admin' | 'architecture' | 'monorepo' | 'self-healing';

interface HeaderNavProps {
  currentMode: AppViewMode;
  onSelectMode: (mode: AppViewMode) => void;
  selectedDeviceOverride: 'auto' | DeviceType;
  onSelectDeviceOverride: (dev: 'auto' | DeviceType) => void;
  detectedOsName: string;
  isMobileDetected: boolean;
  syncedCount: number;
  onOpenGithubSync: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentMode,
  onSelectMode,
  selectedDeviceOverride,
  onSelectDeviceOverride,
  detectedOsName,
  isMobileDetected,
  syncedCount,
  onOpenGithubSync,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner Status Bar */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/80 to-purple-950/80 border-b border-indigo-900/40 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold">Cloudflare DNS Proxy: ON</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
            Edge Router Engine: <span className="text-indigo-300">CF-Ray 8fa9210-HAN</span>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-white">{syncedCount}/26</strong> Secrets & Vars Synchronized
          </span>
        </div>

        {/* Device Simulation Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
            Mô phỏng thiết bị:
          </span>
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-700/60 font-mono text-[11px]">
            <button
              onClick={() => onSelectDeviceOverride('auto')}
              className={`px-2 py-0.5 rounded ${selectedDeviceOverride === 'auto' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="Tự động bóc tách từ User-Agent thực tế"
            >
              Auto ({detectedOsName})
            </button>
            <button
              onClick={() => onSelectDeviceOverride('ios')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 ${selectedDeviceOverride === 'ios' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="iPhone 16 Pro (iOS)"
            >
              <Smartphone className="w-3 h-3" /> iOS
            </button>
            <button
              onClick={() => onSelectDeviceOverride('android')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 ${selectedDeviceOverride === 'android' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="Google Pixel 9 (Android)"
            >
              <Smartphone className="w-3 h-3" /> Android
            </button>
            <button
              onClick={() => onSelectDeviceOverride('windows')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 ${selectedDeviceOverride === 'windows' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="Windows 11 PC"
            >
              <Monitor className="w-3 h-3" /> Windows
            </button>
            <button
              onClick={() => onSelectDeviceOverride('macos')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 ${selectedDeviceOverride === 'macos' ? 'bg-purple-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              title="MacBook Pro (macOS)"
            >
              <Laptop className="w-3 h-3" /> macOS
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4rem] py-2 flex-wrap gap-2">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">Hendy<span className="text-indigo-400">AppStore</span></span>
                <span className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SERVERLESS MONOREPO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                Adaptive UI • 26 Secrets Sync • Matrix CI/CD
              </p>
            </div>
          </div>

          {/* Navigation Tabs (scrollable on mobile) */}
          <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => onSelectMode('web-user')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                currentMode === 'web-user'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Web-User Store</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-slate-800/80 text-sky-300 font-mono">
                {isMobileDetected ? 'Mobile' : 'Desktop'}
              </span>
            </button>

            <button
              onClick={() => onSelectMode('web-admin')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                currentMode === 'web-admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Web-Admin Studio</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-slate-800/80 text-purple-300 font-mono">
                26
              </span>
            </button>

            <button
              onClick={() => onSelectMode('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                currentMode === 'architecture'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-pink-400" />
              <span>Sơ Đồ 4 Tầng</span>
            </button>

            <button
              onClick={() => onSelectMode('monorepo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                currentMode === 'monorepo'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Mã Nguồn</span>
            </button>

            <button
              onClick={() => onSelectMode('self-healing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                currentMode === 'self-healing'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-rose-400" />
              <span>Bot & D1</span>
            </button>
          </nav>

          {/* Sync to GitHub & Deploy Pages Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGithubSync}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 border border-emerald-500/40 transition active:scale-95 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>Sync to GitHub & Pages</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
