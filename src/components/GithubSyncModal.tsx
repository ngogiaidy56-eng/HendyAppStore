/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GitBranch,
  Cloud,
  CheckCircle2,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Check,
  ArrowRight,
  Terminal,
  FileCode,
} from 'lucide-react';
import { SecretItem } from '../core/types';

interface GithubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  secrets: SecretItem[];
  onTriggerSync: () => Promise<void>;
  isSyncing: boolean;
  syncStatus: {
    isSynced: boolean;
    lastSyncedAt: string;
    repo: string;
    cfPagesUrl: string;
    deploymentStatus: 'idle' | 'building' | 'deployed' | 'error';
    commitSha: string;
  };
}

export const GithubSyncModal: React.FC<GithubSyncModalProps> = ({
  isOpen,
  onClose,
  secrets,
  onTriggerSync,
  isSyncing,
  syncStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Sync to GitHub & Deploy Cloudflare Pages</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                  Automated CI/CD
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Xuất bản toàn bộ mã nguồn Monorepo & 26 biến bảo mật lên GitHub và triển khai Pages.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span>GitHub Repository:</span>
            </div>
            <div className="font-mono text-sm text-indigo-300 font-bold truncate">
              {syncStatus.repo}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Branch: <span className="text-white">main</span> • Commit: <span className="text-emerald-400">{syncStatus.commitSha}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
              <Cloud className="w-4 h-4 text-sky-400" />
              <span>Cloudflare Pages URL:</span>
            </div>
            <div className="font-mono text-sm text-sky-300 font-bold truncate">
              {syncStatus.cfPagesUrl}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Trạng thái: </span>
              <strong className="text-emerald-400 capitalize">
                {syncStatus.deploymentStatus === 'building' ? 'Đang Biên Dịch...' : 'Đã Triển Khai (Live)'}
              </strong>
            </div>
          </div>
        </div>

        {/* 4 Pipeline Steps */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quy trình tự động hóa môi trường:
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. Đóng gói mã nguồn Monorepo (`apps/`, `workers/`, `functions/`)</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-400">Sẵn sàng</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2. Mã hóa Libsodium và nạp 26 biến bảo mật & secrets</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">{secrets.length}/26 Vars</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3. Đẩy commit lên GitHub (`hendy-ecosystem/HendyAppStore`)</span>
              </span>
              <span className="text-[10px] font-mono text-indigo-400">git push</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>4. Trigger Cloudflare Pages Build Hook & Workers API</span>
              </span>
              <span className="text-[10px] font-mono text-sky-400">Edge Deploy</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition ${
              isSyncing
                ? 'bg-indigo-700/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-600/30 active:scale-98'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang Đẩy Lên GitHub & Triển Khai Pages...' : 'Sync to GitHub & Deploy Cloudflare Pages'}
          </button>
          <a
            href={syncStatus.cfPagesUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <ExternalLink className="w-4 h-4 text-sky-400" />
            <span>Mở Trang Pages</span>
          </a>
        </div>
      </div>
    </div>
  );
};
