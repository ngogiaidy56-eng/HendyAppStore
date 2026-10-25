/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Upload,
  FileCode,
  Terminal,
  Activity,
  Search,
  Filter,
  Check,
  Smartphone,
  Monitor,
  Cloud,
  GitBranch,
  ShieldAlert,
  Server,
  Zap,
} from 'lucide-react';
import { BuildMatrixJob, DeviceInfo, SecretCategory, SecretItem, SyncLog } from '../core/types';
import { getCategoryMetadata, validateSecret } from '../core/secrets26';

interface WebAdminViewProps {
  deviceInfo: DeviceInfo;
  secrets: SecretItem[];
  onUpdateSecret: (id: string, newValue: string) => void;
  onSyncAllSecrets: () => Promise<void>;
  isSyncing: boolean;
  syncLogs: SyncLog[];
  onClearLogs: () => void;
  matrixJobs: BuildMatrixJob[];
  onTriggerMatrixBuild: (target: 'all' | 'android' | 'ios' | 'windows') => void;
  isBuilding: boolean;
}

export const WebAdminView: React.FC<WebAdminViewProps> = ({
  deviceInfo,
  secrets,
  onUpdateSecret,
  onSyncAllSecrets,
  isSyncing,
  syncLogs,
  onClearLogs,
  matrixJobs,
  onTriggerMatrixBuild,
  isBuilding,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SecretCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [editingSecret, setEditingSecret] = useState<SecretItem | null>(null);
  const [editValue, setEditValue] = useState('');

  // Cert upload tool state
  const [certType, setCertType] = useState<'keystore' | 'p12' | 'pfx' | 'mobileprovision'>('keystore');
  const [uploadedBase64, setUploadedBase64] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  // Active matrix runner tab
  const [selectedRunnerJob, setSelectedRunnerJob] = useState<string>('job-android');

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSecrets = secrets.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartEdit = (secret: SecretItem) => {
    setEditingSecret(secret);
    setEditValue(secret.value);
  };

  const handleSaveEdit = () => {
    if (!editingSecret) return;
    onUpdateSecret(editingSecret.id, editValue);
    setEditingSecret(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Clean = result.includes(',') ? result.split(',')[1] : result;
      setUploadedBase64(base64Clean);
      setUploadSuccessMessage(`Đã mã hóa ${file.name} thành công (${base64Clean.length} ký tự Base64).`);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyBase64ToSecret = () => {
    if (!uploadedBase64) return;
    let targetKey = 'ANDROID_KEYSTORE_BASE64';
    if (certType === 'p12') targetKey = 'IOS_CERTIFICATE_P12_BASE64';
    if (certType === 'pfx') targetKey = 'WINDOWS_CERT_PFX_BASE64';
    if (certType === 'mobileprovision') targetKey = 'PROVISION_PROFILE_BASE64';

    const targetSec = secrets.find((s) => s.key === targetKey);
    if (targetSec) {
      onUpdateSecret(targetSec.id, uploadedBase64);
      setUploadSuccessMessage(`Đã gán Base64 trực tiếp vào biến ${targetKey} thành công!`);
    }
  };

  const activeJob = matrixJobs.find((j) => j.id === selectedRunnerJob) || matrixJobs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Tầng Điều Hành Quản Trị (Web-Admin Core)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {deviceInfo.isMobile ? '📱 Mobile CMS Pocket Layout' : '💻 Full Dev Studio Layout'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Form nạp tập trung 26 Secrets & Variables, mã hóa Libsodium và tự động đồng bộ sang GitHub Actions API & Cloudflare Workers.
            </p>
          </div>
        </div>

        {/* Sync Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onSyncAllSecrets}
            disabled={isSyncing}
            className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition ${
              isSyncing
                ? 'bg-indigo-700/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-600/30 active:scale-98'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang mã hóa Libsodium & Sync...' : 'Đồng Bộ 26 Biến Sang GitHub API'}
          </button>
        </div>
      </div>

      {/* Grid: 26 Secrets Form (8 cols) + Cert Encryptor & Matrix Trigger (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 26 Secrets Table & Filter (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Kho Lưu Trữ 26 Biến Bảo Mật & Môi Trường</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 font-semibold">
                    {secrets.filter((s) => s.synced).length}/26 Synced
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tự động phân nhóm theo chuẩn kiến trúc: Android, iOS, Windows, Cloudflare, GitHub, AI/Bot.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm biến theo tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                Tất cả (26)
              </button>
              {(
                [
                  'android_keystore',
                  'ios_provisioning',
                  'windows_signtool',
                  'cloudflare_infra',
                  'github_sync',
                  'security_observability',
                ] as const
              ).map((cat) => {
                const meta = getCategoryMetadata(cat);
                const count = secrets.filter((s) => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{meta.badge}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 font-mono">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secrets List */}
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredSecrets.map((secret) => {
                const isRevealed = revealedIds.has(secret.id);
                const meta = getCategoryMetadata(secret.category);
                return (
                  <div
                    key={secret.id}
                    className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-indigo-300">
                          {secret.key}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                          {meta.badge}
                        </span>
                        {secret.isBase64 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Base64 Format
                          </span>
                        )}
                        {secret.synced ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Synced
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                            <AlertTriangle className="w-3 h-3" /> Chờ đồng bộ
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {secret.isSecret && (
                          <button
                            onClick={() => toggleReveal(secret.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60"
                            title={isRevealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleStartEdit(secret)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          Sửa
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2">{secret.description}</p>

                    {/* Value Container */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 break-all select-all flex items-center justify-between gap-2">
                      <span className="truncate">
                        {secret.isSecret && !isRevealed
                          ? '••••••••••••••••••••••••••••••••••••••••••••••••'
                          : secret.value}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(secret.value)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 shrink-0 font-sans font-semibold"
                      >
                        Copy
                      </button>
                    </div>

                    {secret.lastSyncedAt && (
                      <div className="mt-1.5 text-[10px] text-slate-400">
                        Lần cuối đồng bộ: <span className="font-mono">{secret.lastSyncedAt}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Secure Cert Upload & Matrix Trigger (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cổng Mã Hóa Tệp Tin Keystore, P12, PFX sang Base64 */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Cổng Mã Hóa Chứng Chỉ Sang Base64</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Chuyển đổi các tệp nhị phân chứng thư (.jks, .p12, .pfx, .mobileprovision) thành chuỗi Base64 sạch để lưu trữ an toàn trong GitHub Secrets.
            </p>

            {/* Select Target Cert Type */}
            <div className="mb-3">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Loại chứng chỉ mục tiêu:
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="keystore">Android Keystore (.jks / .keystore)</option>
                <option value="p12">Apple Distribution Certificate (.p12)</option>
                <option value="pfx">Windows Authenticode Certificate (.pfx)</option>
                <option value="mobileprovision">iOS Provisioning Profile (.mobileprovision)</option>
              </select>
            </div>

            {/* Drag & Drop File Input */}
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-5 text-center transition bg-slate-950/40">
              <input
                type="file"
                id="cert-file-input"
                onChange={handleFileUpload}
                accept=".jks,.keystore,.p12,.pfx,.mobileprovision"
                className="hidden"
              />
              <label htmlFor="cert-file-input" className="cursor-pointer block">
                <Key className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-white block">
                  {uploadedFileName ? uploadedFileName : 'Chọn hoặc thả tệp chứng chỉ vào đây'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Xử lý cục bộ tại trình duyệt bằng FileReader API
                </span>
              </label>
            </div>

            {uploadSuccessMessage && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                {uploadSuccessMessage}
              </div>
            )}

            {uploadedBase64 && (
              <div className="mt-3 space-y-2">
                <button
                  onClick={handleApplyBase64ToSecret}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Cập Nhật Ngay Vào Biến Hệ Thống
                </button>
              </div>
            )}
          </div>

          {/* GitHub Actions Isolated Build Runners Trigger */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Ma Trận Biên Dịch Multi-OS</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                GitHub Runners
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Kích hoạt quy trình CI/CD nạp 26 biến môi trường, tự động đóng gói APK (V2/V3), IPA (Fastlane OTA) và EXE (SignTool) sạch.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => onTriggerMatrixBuild('all')}
                disabled={isBuilding}
                className="py-2 px-2 text-center rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition disabled:opacity-50"
              >
                {isBuilding ? 'Running...' : '⚡ All OS'}
              </button>
              <button
                onClick={() => onTriggerMatrixBuild('android')}
                disabled={isBuilding}
                className="py-2 px-2 text-center rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 transition"
              >
                🤖 Android
              </button>
              <button
                onClick={() => onTriggerMatrixBuild('ios')}
                disabled={isBuilding}
                className="py-2 px-2 text-center rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-400 transition"
              >
                🍎 iOS OTA
              </button>
            </div>

            {/* Runner Selector & Live Log Console */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs">
                {matrixJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedRunnerJob(job.id)}
                    className={`flex-1 py-1.5 text-[11px] rounded-lg font-mono font-medium transition ${
                      selectedRunnerJob === job.id
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {job.os.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Terminal View */}
              <div className="rounded-2xl bg-black border border-slate-800 p-3 font-mono text-[11px] text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Runner: {activeJob.os}-latest ({activeJob.status})
                  </span>
                  <span>{activeJob.fileSize}</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {activeJob.steps.map((st, i) => (
                    <div key={i} className="text-slate-400">
                      <span className="text-indigo-400">[{st.status === 'completed' ? '✓' : '...'}]</span>{' '}
                      <span className="text-white font-semibold">{st.name}</span>
                      <p className="text-[10px] text-slate-400 ml-4">{st.log}</p>
                    </div>
                  ))}
                  <div className="text-emerald-400 pt-1 border-t border-slate-800/80 font-bold">
                    ➔ Output: {activeJob.outputArtifact}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Status Sync Logs Stream */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Live Status Sync Logs (Thời Gian Thực)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearLogs}
              className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Xóa Nhật Ký
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
          {syncLogs.length === 0 ? (
            <div className="text-slate-400 text-center py-4">Chưa có nhật ký ghi nhận.</div>
          ) : (
            syncLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-slate-300">
                <span className="text-slate-400 text-[10px] shrink-0">{log.timestamp}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                    log.source === 'Edge-Router'
                      ? 'bg-sky-500/20 text-sky-300'
                      : log.source === 'Workers-API'
                      ? 'bg-purple-500/20 text-purple-300'
                      : log.source === 'GitHub-API'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : log.source === 'Self-Healing'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {log.source}
                </span>
                <span
                  className={
                    log.level === 'success'
                      ? 'text-emerald-400'
                      : log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'error'
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Secret Modal */}
      {editingSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Chỉnh Sửa Biến: {editingSecret.key}</h3>
            <p className="text-xs text-slate-400 mb-4">{editingSecret.description}</p>
            <div className="mb-4">
              <label className="text-xs text-slate-300 block mb-1 font-semibold">Giá trị mới:</label>
              <textarea
                rows={4}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingSecret(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
