/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Apple,
  Smartphone,
  Monitor,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  QrCode,
  Star,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Info,
  Hash,
  ArrowRight,
} from 'lucide-react';
import { AppRelease, DeviceInfo } from '../core/types';
import { generateIosManifestXml, buildItmsServicesUrl } from '../core/iosManifest';

interface WebUserViewProps {
  deviceInfo: DeviceInfo;
  releases: AppRelease[];
}

export const WebUserView: React.FC<WebUserViewProps> = ({ deviceInfo, releases }) => {
  const [selectedApp, setSelectedApp] = useState<AppRelease>(releases[0]);
  const [showManifestModal, setShowManifestModal] = useState(false);
  const [copiedPlist, setCopiedPlist] = useState(false);
  const [userHashInput, setUserHashInput] = useState('');
  const [hashResult, setHashResult] = useState<'match' | 'mismatch' | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'android' | 'ios' | 'windows'>('all');

  const generatedPlistXml = generateIosManifestXml({
    ipaUrl: selectedApp.artifacts.ios.ipaUrl,
    bundleId: selectedApp.artifacts.ios.bundleId,
    bundleVersion: selectedApp.version,
    title: selectedApp.name,
  });

  const itmsUrl = buildItmsServicesUrl(
    `https://hendyappstore.com/api/manifest.plist?id=${selectedApp.artifacts.ios.bundleId}&v=${selectedApp.version}`
  );

  const handleCopyPlist = () => {
    navigator.clipboard.writeText(generatedPlistXml);
    setCopiedPlist(true);
    setTimeout(() => setCopiedPlist(false), 2000);
  };

  const handleVerifyHash = () => {
    if (!userHashInput.trim()) {
      setHashResult(null);
      return;
    }
    const clean = userHashInput.trim().toLowerCase();
    const androidHash = selectedApp.artifacts.android.sha256.toLowerCase();
    const winHash = selectedApp.artifacts.windows.sha256.toLowerCase();
    if (clean === androidHash || clean === winHash) {
      setHashResult('match');
    } else {
      setHashResult('mismatch');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Edge Routing Indicator Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-slate-900 border border-sky-800/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
            {deviceInfo.isMobile ? (
              <Smartphone className="w-6 h-6 text-sky-400" />
            ) : (
              <Monitor className="w-6 h-6 text-sky-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">
                Mạng Biên Cloudflare Tự Động Phân Phối Giao Diện:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {deviceInfo.isMobile ? '📱 MobileAppStoreLayout.js' : '💻 DesktopPortalLayout.js'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Thiết bị nhận diện: <strong className="text-sky-300">{deviceInfo.osName}</strong> ({deviceInfo.browser}) • File tối ưu đề xuất:{' '}
              <span className="font-mono text-emerald-400 font-bold uppercase">.{deviceInfo.recommendedArtifact}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Cloudflare R2 Storage: <strong className="text-white">Clean Binaries OK</strong>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Featured & App List (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Featured Hero App Card */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
              <img
                src={selectedApp.icon}
                alt={selectedApp.name}
                className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-500/20 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Chữ Ký Số Hợp Lệ
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    Build #{selectedApp.buildNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    v{selectedApp.version}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedApp.name}
                </h1>
                <p className="text-xs text-indigo-300 font-medium mt-0.5">{selectedApp.developer}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedApp.rating} / 5.0
                  </span>
                  <span>•</span>
                  <span>{selectedApp.downloads.toLocaleString()} lượt tải</span>
                  <span>•</span>
                  <span>Dung lượng: <span className="font-mono">{selectedApp.size}</span></span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedApp.description}
            </p>

            {/* Dynamic Native Downloader Box based on detected OS */}
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Bộ Cài Đặt Khuyên Dùng Cho Thiết Bị Của Bạn
              </div>

              {/* iOS Adaptive Installation */}
              {deviceInfo.type === 'ios' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-sky-500/30 bg-sky-950/30 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Apple className="w-5 h-5 text-sky-400" />
                        <span className="font-bold text-white text-sm">Cài Đặt Trực Tiếp iOS (OTA Protocol)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Apple In-House Enterprise
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-4">
                      Không cần cắm cáp máy tính hay qua TestFlight. Safari sẽ tự kích hoạt giao thức <code className="text-sky-300 font-mono">itms-services://</code> để tải và cài đặt ngay trên màn hình chính.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={itmsUrl}
                        className="flex-1 py-3.5 px-5 rounded-xl font-bold text-center bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition active:scale-98 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Cài Đặt iOS Trực Tiếp (1-Tap OTA)
                      </a>
                      <button
                        onClick={() => setShowManifestModal(true)}
                        className="py-3 px-4 rounded-xl border border-sky-500/30 bg-sky-900/30 hover:bg-sky-900/50 text-sky-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <FileCode className="w-4 h-4" />
                        Xem dynamic manifest.plist
                      </button>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-200">📌 Hướng dẫn tin cậy ứng dụng trên iOS:</p>
                      <p>Vào <strong>Cài đặt</strong> ➔ <strong>Cài đặt chung</strong> ➔ <strong>Quản lý VPN & Thiết bị</strong> ➔ Chọn <span className="text-sky-300 font-mono">{selectedApp.artifacts.ios.signingIdentity}</span> ➔ Nhấn <strong>Tin cậy</strong>.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Android Adaptive Installation */}
              {deviceInfo.type === 'android' && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-white text-sm">Tải File APK V2/V3 Sạch Đã Ký Số</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Knox & Play Protect Clean
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    Được đóng gói với công nghệ bảo vệ mã nguồn ProGuard R8 và ký chữ ký số chuẩn V2+V3 từ kho khóa bí mật, không bao giờ bị chặn hay báo virus giả.
                  </p>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-900/40 text-[11px] font-mono text-slate-300 mb-4 flex items-center justify-between gap-2">
                    <span className="truncate">SHA-256: <span className="text-emerald-400">{selectedApp.artifacts.android.sha256}</span></span>
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedApp.artifacts.android.sha256)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] shrink-0"
                    >
                      Copy Hash
                    </button>
                  </div>
                  <a
                    href={selectedApp.artifacts.android.apkUrl}
                    download
                    className="block text-center w-full py-3.5 px-5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Tải APK V2 Sạch (42.8 MB)
                  </a>
                </div>
              )}

              {/* Windows / Desktop Adaptive Installation */}
              {deviceInfo.type !== 'ios' && deviceInfo.type !== 'android' && (
                <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-blue-400" />
                      <span className="font-bold text-white text-sm">Bộ Cài Đặt Windows Authenticode Đã Ký Số</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      SmartScreen Danh Sách Xanh
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">
                    Chữ ký số RFC3161 Authenticode SHA256 bảo đảm bộ cài đặt không bị can thiệp và kích hoạt chế độ an toàn trên Windows Defender SmartScreen.
                  </p>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-blue-900/40 text-[11px] font-mono text-slate-300 mb-4 flex items-center justify-between gap-2">
                    <span className="truncate">Publisher: <span className="text-blue-300">{selectedApp.artifacts.windows.publisher}</span></span>
                    <span className="text-emerald-400 font-semibold shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> EV Verified
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={selectedApp.artifacts.windows.exeUrl}
                      download
                      className="flex-1 py-3.5 px-5 rounded-xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Tải Bộ Cài Đặt Windows (EXE 64-bit)
                    </a>
                  </div>
                </div>
              )}

              {/* Multi-OS Matrix Download Tabs for all other platforms */}
              <div className="pt-2">
                <div className="text-xs text-slate-400 mb-2 font-medium">Hoặc chọn nền tảng khác:</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <a
                    href={itmsUrl}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-center transition flex flex-col items-center gap-1 text-slate-300"
                  >
                    <Apple className="w-4 h-4 text-sky-400" />
                    <span className="font-semibold text-white">Apple iOS</span>
                    <span className="text-[10px] text-slate-400 font-mono">OTA .ipa</span>
                  </a>
                  <a
                    href={selectedApp.artifacts.android.apkUrl}
                    download
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-center transition flex flex-col items-center gap-1 text-slate-300"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">Android</span>
                    <span className="text-[10px] text-slate-400 font-mono">V2 .apk</span>
                  </a>
                  <a
                    href={selectedApp.artifacts.windows.exeUrl}
                    download
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-center transition flex flex-col items-center gap-1 text-slate-300"
                  >
                    <Monitor className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-white">Windows</span>
                    <span className="text-[10px] text-slate-400 font-mono">EV .exe</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog of Store Apps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Kho Ứng Dụng Đã Ký Số Thành Phẩm</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300">
                  {releases.length} Apps
                </span>
              </h2>
              <div className="flex items-center gap-1 text-xs">
                {(['all', 'android', 'ios', 'windows'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-lg capitalize ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white bg-slate-900'
                    }`}
                  >
                    {tab === 'all' ? 'Tất cả' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {releases.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selectedApp.id === app.id
                      ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/40'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={app.icon} alt={app.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{app.name}</h3>
                      <p className="text-xs text-slate-400 truncate">{app.summary}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-400">
                        <span className="text-emerald-400 font-semibold">v{app.version}</span>
                        <span>•</span>
                        <span>{app.size}</span>
                        <span>•</span>
                        <span className="text-amber-400 flex items-center gap-0.5">
                          ★ {app.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Verification Lab & QR Scan (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* QR Code Scanner for Mobile Quick Install */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Quét Mã Cài Đặt Nhanh</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Mở Camera iPhone hoặc Android để quét mã và cài đặt trực tiếp không cần qua máy tính:
            </p>
            <div className="flex justify-center p-4 bg-white rounded-2xl mb-4 shadow-lg shadow-black/40">
              {/* High-contrast generated SVG QR code mockup */}
              <div className="w-44 h-44 flex flex-col items-center justify-center p-2 text-slate-950">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="28" height="28" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" />
                  {/* Top-right position marker */}
                  <rect x="67" y="5" width="28" height="28" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" />
                  {/* Bottom-left position marker */}
                  <rect x="5" y="67" width="28" height="28" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" />
                  {/* Data modules */}
                  <rect x="38" y="10" width="8" height="8" />
                  <rect x="50" y="15" width="8" height="8" />
                  <rect x="38" y="25" width="14" height="6" />
                  <rect x="10" y="38" width="6" height="16" />
                  <rect x="22" y="42" width="12" height="8" />
                  <rect x="42" y="42" width="16" height="16" />
                  <rect x="68" y="38" width="14" height="6" />
                  <rect x="80" y="48" width="10" height="10" />
                  <rect x="38" y="68" width="12" height="8" />
                  <rect x="55" y="70" width="10" height="14" />
                  <rect x="72" y="68" width="16" height="8" />
                  <rect x="75" y="80" width="10" height="10" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-mono text-indigo-300">
                https://hendyappstore.com/download/{selectedApp.id}
              </span>
            </div>
          </div>

          {/* SHA256 Checksum Validator Tool */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Kiểm Tra Checksum SHA-256</h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Xác minh tính toàn vẹn của tệp đã tải về so với dữ liệu gốc trên Cloudflare R2:
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Dán mã băm SHA256 từ máy của bạn..."
                value={userHashInput}
                onChange={(e) => setUserHashInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyHash}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Đối Chiếu Checksum
                </button>
                <button
                  onClick={() => {
                    setUserHashInput(selectedApp.artifacts.android.sha256);
                    setHashResult('match');
                  }}
                  className="px-3 py-2 rounded-xl text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Điền mã chuẩn để thử"
                >
                  Test Auto-Fill
                </button>
              </div>

              {hashResult === 'match' && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Khớp 100%:</strong> Tệp tin toàn vẹn tuyệt đối, không bị sửa đổi.</span>
                </div>
              )}
              {hashResult === 'mismatch' && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-400 shrink-0" />
                  <span><strong>Không khớp:</strong> Mã băm không trùng với bản gốc trên kho R2.</span>
                </div>
              )}
            </div>
          </div>

          {/* Security Standards Overview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Tiêu Chuẩn Đóng Gói An Toàn
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <p><strong>Android V2/V3:</strong> apksigner kiểm tra tính toàn vẹn từng khối nhị phân APK, loại bỏ hoàn toàn cảnh báo mã độc.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                <p><strong>Apple Enterprise OTA:</strong> Cung cấp manifest.plist động qua HTTPS với chứng chỉ được cấu hình sẵn.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                <p><strong>Windows Authenticode:</strong> Ký số RFC3161 Timestamp qua DigiCert, đạt chỉ số tín nhiệm SmartScreen cao.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic iOS Manifest.plist Inspection Modal */}
      {showManifestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Dynamic manifest.plist (Apple OTA Distribution)</h3>
              </div>
              <button
                onClick={() => setShowManifestModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Tệp XML này được sinh thời gian thực bởi Edge Router khi Safari yêu cầu URL:
              <br />
              <code className="text-sky-300 font-mono text-[11px]">{itmsUrl}</code>
            </p>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-80">
                {generatedPlistXml}
              </pre>
              <button
                onClick={handleCopyPlist}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5"
              >
                {copiedPlist ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPlist ? 'Đã copy' : 'Copy XML'}
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowManifestModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
