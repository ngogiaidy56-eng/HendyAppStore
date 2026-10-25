/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bot,
  Database,
  ShieldAlert,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Server,
  Zap,
} from 'lucide-react';

interface Incident {
  id: string;
  timestamp: string;
  trigger: string;
  aiDiagnostic: string;
  autoRemediation: string;
  status: 'resolved' | 'healing' | 'pending';
}

export const SelfHealingView: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'inc-101',
      timestamp: '2026-10-25 06:40:12',
      trigger: 'Android Build Runner #402: Keystore Base64 decode failed with invalid padding',
      aiDiagnostic:
        'Phát hiện chuỗi Base64 bị ngắt dòng hoặc thiếu ký tự đệm "=" ở cuối tệp tin JKS.',
      autoRemediation:
        'Bot tự động chuẩn hóa chuỗi Base64, bổ sung ký tự đệm chuẩn MIME và kích hoạt lại job Android.',
      status: 'resolved',
    },
    {
      id: 'inc-102',
      timestamp: '2026-10-25 06:55:00',
      trigger: 'iOS Fastlane Gym Archive: Provisioning profile bundleId mismatch',
      aiDiagnostic:
        'Tệp .mobileprovision không chứa entitlement phù hợp với bundle identifier com.hendy.superapp.',
      autoRemediation:
        'Tự động chọn lại Provisioning Profile In-House Enterprise hợp lệ từ kho D1.',
      status: 'resolved',
    },
  ]);

  const [simulating, setSimulating] = useState(false);
  const [selectedTable, setSelectedTable] = useState<'secrets_metadata' | 'sync_audit_logs' | 'app_releases'>('secrets_metadata');

  const handleSimulateIncident = () => {
    setSimulating(true);
    const newInc: Incident = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      trigger: 'Windows SignTool Error: Authenticode timestamp server timeout (DigiCert RFC3161)',
      aiDiagnostic: 'Máy chủ đóng dấu thời gian chính bị nghẽn mạng biên, dẫn tới SignTool trả về mã lỗi 0x80070002.',
      autoRemediation: 'Tự động kích hoạt cơ chế Fallback sang máy chủ dự phòng Sectigo RFC3161 Timestamp và ký số thành công.',
      status: 'healing',
    };

    setIncidents([newInc, ...incidents]);

    setTimeout(() => {
      setIncidents((prev) =>
        prev.map((item) => (item.id === newInc.id ? { ...item, status: 'resolved' } : item))
      );
      setSimulating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/40 via-indigo-950/40 to-slate-900 border border-rose-800/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              SELF-HEALING AUTOMATION & D1
            </span>
            <span className="text-xs text-slate-400 font-mono">Edge Bot Worker</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Bot Tự Vá Lỗi Hệ Thống & Cơ Sở Dữ Liệu Cloudflare D1
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Tích hợp Serverless Worker tiếp nhận Failure Webhooks từ GitHub Actions, phân tích nhật ký lỗi qua LLM API Key, tự động vá cấu hình và lưu vết kiểm toán vào D1 Serverless SQL Database.
          </p>
        </div>

        <div>
          <button
            onClick={handleSimulateIncident}
            disabled={simulating}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${simulating ? 'animate-bounce' : ''}`} />
            {simulating ? 'Đang phân tích & tự vá lỗi...' : 'Mô Phỏng Lỗi & Kích Hoạt Vá Tự Động'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Self-Healing Incidents Timeline (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">Nhật Ký Tự Vá Lỗi (Incident Remediation)</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300">
                AI LLM Agent Active
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2.5 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">{inc.timestamp}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300 animate-pulse'
                      }`}
                    >
                      {inc.status === 'resolved' ? '✓ ĐÃ TỰ VÁ LỖI XONG' : 'ĐANG XỬ LÝ...'}
                    </span>
                  </div>

                  <div className="text-xs text-rose-300 font-medium">
                    <strong>Lỗi phát sinh:</strong> {inc.trigger}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
                    <div className="text-purple-300 font-semibold mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" /> Phân tích AI & Giải Pháp:
                    </div>
                    <p className="text-slate-300 mb-1">{inc.aiDiagnostic}</p>
                    <p className="text-emerald-400 font-medium">➔ {inc.autoRemediation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cloudflare D1 Serverless Database Browser (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Cơ Sở Dữ Liệu Cloudflare D1 (SQL Tables)</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                e57c6b90-1a2b
              </span>
            </div>

            {/* Table Selector */}
            <div className="flex items-center gap-2 mb-4 text-xs font-mono">
              <button
                onClick={() => setSelectedTable('secrets_metadata')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedTable === 'secrets_metadata'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                secrets_metadata
              </button>
              <button
                onClick={() => setSelectedTable('sync_audit_logs')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedTable === 'sync_audit_logs'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                sync_audit_logs
              </button>
              <button
                onClick={() => setSelectedTable('app_releases')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedTable === 'app_releases'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                app_releases
              </button>
            </div>

            {/* Simulated SQL Table Content */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto text-[11px] font-mono">
              {selectedTable === 'secrets_metadata' && (
                <table className="w-full text-left">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">key</th>
                      <th className="p-2.5">category</th>
                      <th className="p-2.5">status</th>
                      <th className="p-2.5">updated_at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-2.5 text-indigo-300 font-bold">ANDROID_KEYSTORE_BASE64</td>
                      <td className="p-2.5">android_keystore</td>
                      <td className="p-2.5 text-emerald-400">synced</td>
                      <td className="p-2.5 text-slate-400">2026-10-25 06:12:00</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-indigo-300 font-bold">IOS_CERTIFICATE_P12_BASE64</td>
                      <td className="p-2.5">ios_provisioning</td>
                      <td className="p-2.5 text-emerald-400">synced</td>
                      <td className="p-2.5 text-slate-400">2026-10-25 06:15:30</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-indigo-300 font-bold">WINDOWS_CERT_PFX_BASE64</td>
                      <td className="p-2.5">windows_signtool</td>
                      <td className="p-2.5 text-emerald-400">synced</td>
                      <td className="p-2.5 text-slate-400">2026-10-25 06:20:11</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-indigo-300 font-bold">CF_ACCESS_AUD</td>
                      <td className="p-2.5">cloudflare_infra</td>
                      <td className="p-2.5 text-emerald-400">synced</td>
                      <td className="p-2.5 text-slate-400">2026-10-25 06:22:00</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {selectedTable === 'sync_audit_logs' && (
                <table className="w-full text-left">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">id</th>
                      <th className="p-2.5">actor</th>
                      <th className="p-2.5">action</th>
                      <th className="p-2.5">status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-2.5 text-slate-400">aud-912</td>
                      <td className="p-2.5 text-purple-300">Web-Admin</td>
                      <td className="p-2.5">SYNC_26_SECRETS</td>
                      <td className="p-2.5 text-emerald-400">200 OK</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-400">aud-913</td>
                      <td className="p-2.5 text-sky-300">Edge-Router</td>
                      <td className="p-2.5">DYNAMIC_MANIFEST_GEN</td>
                      <td className="p-2.5 text-emerald-400">200 OK</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-400">aud-914</td>
                      <td className="p-2.5 text-rose-300">Self-Healing</td>
                      <td className="p-2.5">AUTO_REMEDIATE_FAIL</td>
                      <td className="p-2.5 text-emerald-400">RESOLVED</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {selectedTable === 'app_releases' && (
                <table className="w-full text-left">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">version</th>
                      <th className="p-2.5">platform</th>
                      <th className="p-2.5">signature_type</th>
                      <th className="p-2.5">artifact_path</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-bold">2.5.4</td>
                      <td className="p-2.5">android</td>
                      <td className="p-2.5">V2+V3 Signed</td>
                      <td className="p-2.5 text-slate-400">binaries/android/*.apk</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-sky-400 font-bold">2.5.4</td>
                      <td className="p-2.5">ios</td>
                      <td className="p-2.5">Enterprise OTA</td>
                      <td className="p-2.5 text-slate-400">binaries/ios/*.ipa</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-400 font-bold">2.5.4</td>
                      <td className="p-2.5">windows</td>
                      <td className="p-2.5">Authenticode EV</td>
                      <td className="p-2.5 text-slate-400">binaries/windows/*.exe</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
