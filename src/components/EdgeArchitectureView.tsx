/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Server,
  Cloud,
  Shield,
  Layers,
  ArrowRight,
  Database,
  Lock,
  Globe,
  Smartphone,
  Cpu,
} from 'lucide-react';

export const EdgeArchitectureView: React.FC = () => {
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulatingFlow, setSimulatingFlow] = useState<'admin_sync' | 'user_download' | null>(null);

  const startFlow = (flow: 'admin_sync' | 'user_download') => {
    setSimulatingFlow(flow);
    setSimulationStep(1);

    const timer = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 4) {
          clearInterval(timer);
          return 4;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const resetFlow = () => {
    setSimulatingFlow(null);
    setSimulationStep(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              ARCHITECTURE SCHEMATIC
            </span>
            <span className="text-xs text-slate-400 font-mono">End-to-End Pipeline</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Sơ Đồ Kiến Trúc Hệ Thống Tổng Hợp: Adaptive UI, Serverless Workers & CI/CD
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl flex items-center gap-1.5 flex-wrap">
            <span>Mô phỏng 4 tầng phối hợp:</span>
            <span className="text-indigo-300 font-semibold">Tầng 1 Admin</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
            <span className="text-sky-300 font-semibold">Tầng 2 Mạng Biên</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
            <span className="text-purple-300 font-semibold">Tầng 3 Core API</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
            <span className="text-emerald-300 font-semibold">Tầng 4 Ma Trận Runners & R2</span>
          </p>
        </div>

        {/* Interactive Simulation Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => startFlow('admin_sync')}
            disabled={simulatingFlow !== null && simulationStep < 4}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            Mô Phỏng Admin Sync Biến
          </button>
          <button
            onClick={() => startFlow('user_download')}
            disabled={simulatingFlow !== null && simulationStep < 4}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mô Phỏng User Tải File Sạch
          </button>
          {simulatingFlow && (
            <button
              onClick={resetFlow}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="Đặt lại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Architectural Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tier 1 */}
        <div
          className={`rounded-3xl border p-5 backdrop-blur-xl transition duration-500 ${
            (simulatingFlow === 'admin_sync' && simulationStep === 1) ||
            (simulatingFlow === 'user_download' && simulationStep === 4)
              ? 'border-indigo-400 bg-indigo-950/40 ring-2 ring-indigo-400/40 shadow-xl'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-extrabold">
              TẦNG 1: ĐIỀU HÀNH ADMIN
            </span>
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">Web Quản Trị (Web-Admin)</h2>
          <ul className="text-xs text-slate-300 space-y-2 mb-4">
            <li className="flex items-start gap-1.5">
              <span className="text-indigo-400">•</span>
              <span>Form nạp tập trung 26 Secrets & Variables</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-indigo-400">•</span>
              <span>Cổng mã hóa Base64 cho Keystore, P12, PFX</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-indigo-400">•</span>
              <span>Theo dõi tiến trình Live Status Sync Logs</span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span>Endpoint: </span><span className="font-mono text-indigo-300">admin.hendyappstore.com</span>
          </div>
        </div>

        {/* Tier 2 */}
        <div
          className={`rounded-3xl border p-5 backdrop-blur-xl transition duration-500 ${
            (simulatingFlow === 'admin_sync' && simulationStep === 2) ||
            (simulatingFlow === 'user_download' && simulationStep === 1)
              ? 'border-sky-400 bg-sky-950/40 ring-2 ring-sky-400/40 shadow-xl'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-sky-400 font-extrabold">
              TẦNG 2: MẠNG BIÊN ĐIỀU HƯỚNG
            </span>
            <Cloud className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">Cloudflare Edge Router</h2>
          <ul className="text-xs text-slate-300 space-y-2 mb-4">
            <li className="flex items-start gap-1.5">
              <span className="text-sky-400">•</span>
              <span>Cloudflare DNS (Proxy: ON, độ trễ 8ms)</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-sky-400">•</span>
              <span>Worker Router bóc tách Hostname & User-Agent</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-sky-400">•</span>
              <span>Gọi ngầm Web-User Core hoặc Web-Admin Core</span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span>Worker: </span><span className="font-mono text-sky-300">edge-router/src/index.js</span>
          </div>
        </div>

        {/* Tier 3 */}
        <div
          className={`rounded-3xl border p-5 backdrop-blur-xl transition duration-500 ${
            (simulatingFlow === 'admin_sync' && simulationStep === 3) ||
            (simulatingFlow === 'user_download' && simulationStep === 2)
              ? 'border-purple-400 bg-purple-950/40 ring-2 ring-purple-400/40 shadow-xl'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-purple-400 font-extrabold">
              TẦNG 3: CORE API & ĐỒNG BỘ
            </span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">Backend API & Libsodium</h2>
          <ul className="text-xs text-slate-300 space-y-2 mb-4">
            <li className="flex items-start gap-1.5">
              <span className="text-purple-400">•</span>
              <span>Tiếp nhận chuỗi/tệp, mã hóa Libsodium</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-purple-400">•</span>
              <span>Gọi GitHub Secrets & Vars REST API tự động đè</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-purple-400">•</span>
              <span>Kích hoạt GitHub Actions API Trigger Workflow</span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span>API: </span><span className="font-mono text-purple-300">POST /api/sync-secrets</span>
          </div>
        </div>

        {/* Tier 4 */}
        <div
          className={`rounded-3xl border p-5 backdrop-blur-xl transition duration-500 ${
            (simulatingFlow === 'admin_sync' && simulationStep === 4) ||
            (simulatingFlow === 'user_download' && simulationStep === 3)
              ? 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-400/40 shadow-xl'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">
              TẦNG 4: MA TRẬN BIÊN DỊCH & XUẤT BẢN
            </span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">GitHub Runners & R2 Storage</h2>
          <ul className="text-xs text-slate-300 space-y-2 mb-4">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400">•</span>
              <span>Android APK V2, iOS IPA OTA, Windows SignTool EXE</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400">•</span>
              <span>Upload tệp sạch lên Cloudflare R2 Storage</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400">•</span>
              <span>Phân phối qua Pages: Web-User không lỗi</span>
            </li>
          </ul>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <span>Storage: </span><span className="font-mono text-emerald-300">r2.hendyappstore.com</span>
          </div>
        </div>
      </div>

      {/* Simulation Callout Banner */}
      {simulatingFlow && (
        <div className="p-5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-sm text-slate-200 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-indigo-400 animate-ping"></div>
            <div>
              <strong className="text-white">
                {simulatingFlow === 'admin_sync'
                  ? 'Quy Trình Đồng Bộ Biến:'
                  : 'Quy Trình Tải Ứng Dụng Không Lỗi:'}
              </strong>{' '}
              {simulatingFlow === 'admin_sync' && simulationStep === 1 && 'Admin chỉnh sửa giá trị biến và ấn nút đồng bộ trên Web-Admin.'}
              {simulatingFlow === 'admin_sync' && simulationStep === 2 && 'Request đi qua Cloudflare Edge Router, xác thực phiên làm việc Zero Trust.'}
              {simulatingFlow === 'admin_sync' && simulationStep === 3 && 'Workers Backend API gọi Libsodium đóng gói hộp bảo mật và gửi REST API lên GitHub.'}
              {simulatingFlow === 'admin_sync' && simulationStep === 4 && 'GitHub Actions nhận 26 biến bảo mật mới, sẵn sàng cho Matrix Build.'}

              {simulatingFlow === 'user_download' && simulationStep === 1 && 'Người dùng truy cập từ iPhone/Android, Cloudflare DNS bóc tách User-Agent.'}
              {simulatingFlow === 'user_download' && simulationStep === 2 && 'Edge Router sinh động manifest.plist và trả về giao diện tối ưu riêng biệt.'}
              {simulatingFlow === 'user_download' && simulationStep === 3 && 'Tải file binary đã ký số (.ipa / .apk / .exe) trực tiếp từ R2 siêu tốc.'}
              {simulatingFlow === 'user_download' && simulationStep === 4 && 'Cài đặt thành công trên máy khách mà không gặp bất kỳ lỗi chứng chỉ nào!'}
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white shrink-0">
            Bước <span className="font-mono">{simulationStep}/4</span>
          </span>
        </div>
      )}
    </div>
  );
};
