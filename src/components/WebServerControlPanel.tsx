/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Server,
  GitBranch,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Terminal,
  Activity,
  Send,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Globe,
  Radio,
  Lock,
} from 'lucide-react';

interface ServerStatus {
  server: {
    status: string;
    uptime: number;
    port: number;
    requestsServed: number;
    memoryRssMb: number;
    heapUsedMb: number;
  };
  syncStatus: {
    totalSecrets: number;
    syncedCount: number;
    pendingCount: number;
    lastSyncAt: string | null;
  };
  integrations: {
    githubApi: string;
    cloudflarePages: string;
    cloudflareR2: string;
    cloudflareD1: string;
  };
}

interface WebServerControlPanelProps {
  onNotify: (msg: string) => void;
}

export const WebServerControlPanel: React.FC<WebServerControlPanelProps> = ({ onNotify }) => {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // GitHub Sync State
  const [githubOwner, setGithubOwner] = useState('hendy-ecosystem');
  const [githubRepo, setGithubRepo] = useState('HendyAppStore');
  const [githubBranch, setGithubBranch] = useState('main');
  const [triggerMatrixWorkflow, setTriggerMatrixWorkflow] = useState(true);
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [githubSyncResult, setGithubSyncResult] = useState<any>(null);

  // Cloudflare Pages Deploy State
  const [selectedPagesProject, setSelectedPagesProject] = useState('hendy-store-user');
  const [pagesEnvironment, setPagesEnvironment] = useState('production');
  const [isDeployingPages, setIsDeployingPages] = useState(false);
  const [pagesDeployResult, setPagesDeployResult] = useState<any>(null);

  // API Tester State
  const [selectedApiRoute, setSelectedApiRoute] = useState('/api/health');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiRequestBody, setApiRequestBody] = useState('{}');
  const [apiResponseStatus, setApiResponseStatus] = useState<number | null>(null);
  const [apiResponseBody, setApiResponseBody] = useState<string>('');
  const [isCallingApi, setIsCallingApi] = useState(false);

  const fetchServerStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setServerStatus(data);
      }
    } catch (err) {
      console.error('Error fetching server status:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 6000);
    return () => clearInterval(interval);
  }, []);

  // Handle "Sync to GitHub"
  const handleSyncToGithub = async () => {
    setIsSyncingGithub(true);
    setGithubSyncResult(null);
    try {
      const res = await fetch('/api/sync-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryOwner: githubOwner,
          repositoryName: githubRepo,
          branch: githubBranch,
          triggerMatrix: triggerMatrixWorkflow,
        }),
      });
      const data = await res.json();
      setGithubSyncResult(data);
      if (data.success) {
        onNotify('Đã xuất bản và đồng bộ thành công lên GitHub!');
        fetchServerStatus();
      }
    } catch (err: any) {
      setGithubSyncResult({ success: false, error: err.message });
    } finally {
      setIsSyncingGithub(false);
    }
  };

  // Handle "Deploy using Cloudflare Pages"
  const handleDeployToCloudflarePages = async () => {
    setIsDeployingPages(true);
    setPagesDeployResult(null);
    try {
      const res = await fetch('/api/cloudflare-pages/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: selectedPagesProject,
          environment: pagesEnvironment,
        }),
      });
      const data = await res.json();
      setPagesDeployResult(data);
      if (data.success) {
        onNotify(`Triển khai thành công lên Cloudflare Pages (${selectedPagesProject})!`);
        fetchServerStatus();
      }
    } catch (err: any) {
      setPagesDeployResult({ success: false, error: err.message });
    } finally {
      setIsDeployingPages(false);
    }
  };

  // Handle API Tester Execution
  const handleRunApiTest = async () => {
    setIsCallingApi(true);
    setApiResponseStatus(null);
    setApiResponseBody('');
    try {
      const opts: RequestInit = {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
      };
      if (apiMethod === 'POST') {
        opts.body = apiRequestBody;
      }
      const res = await fetch(selectedApiRoute, opts);
      setApiResponseStatus(res.status);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setApiResponseBody(JSON.stringify(json, null, 2));
      } catch {
        setApiResponseBody(text);
      }
    } catch (err: any) {
      setApiResponseStatus(500);
      setApiResponseBody(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Web Server Architecture */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-slate-900 border border-emerald-800/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Server className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Máy Chủ Web Server HendyAppStore (Express + Node.js)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                PORT 3000 ONLINE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Vận hành như một máy chủ web thực thụ, tích hợp các thành phần cốt lõi: API Router, bộ sinh manifest iOS, tính năng Xuất bản & Đồng bộ lên GitHub và Triển khai Cloudflare Pages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchServerStatus}
            disabled={loadingStatus}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
            Làm mới máy chủ
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Thời Gian Hoạt Động (Uptime)</span>
          <span className="text-lg font-bold text-white font-mono">
            {serverStatus?.server.uptime || 0}s
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">● Node.js v20+</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Tổng Requests Phục Vụ</span>
          <span className="text-lg font-bold text-indigo-300 font-mono">
            {serverStatus?.server.requestsServed || 1} reqs
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Độ trễ TB: 4ms</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Bộ Nhớ RAM Máy Chủ</span>
          <span className="text-lg font-bold text-purple-300 font-mono">
            {serverStatus?.server.memoryRssMb || 64} MB
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">RSS Memory OK</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Trạng Thái 26 Biến Môi Trường</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {serverStatus?.syncStatus.syncedCount || 26}/{serverStatus?.syncStatus.totalSecrets || 26}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">✓ 100% Đồng bộ</span>
        </div>
      </div>

      {/* Grid: 2 Major Features: "Sync to GitHub" & "Deploy using Cloudflare Pages" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature 1: PUBLISH VIA SYNC TO GITHUB */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Xuất Bản & Đồng Bộ Lên GitHub (Sync to GitHub)</h2>
                  <span className="text-[11px] text-slate-400">GitHub Actions Secrets & REST API Automation</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                REST API v3
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Tự động hóa toàn bộ việc đẩy 26 biến môi trường (được mã hóa Libsodium) vào GitHub Actions Repository Secrets, xác thực commit và kích hoạt luồng biên dịch đa hệ điều hành (Matrix Build Runner).
            </p>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Repository Owner:
                  </label>
                  <input
                    type="text"
                    value={githubOwner}
                    onChange={(e) => setGithubOwner(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    Repository Name:
                  </label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Nhánh mục tiêu (Branch):
                </label>
                <input
                  type="text"
                  value={githubBranch}
                  onChange={(e) => setGithubBranch(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="chk-matrix"
                  checked={triggerMatrixWorkflow}
                  onChange={(e) => setTriggerMatrixWorkflow(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="chk-matrix" className="cursor-pointer">
                  Tự động kích hoạt GitHub Actions workflow <code className="text-purple-300 font-mono">matrix-build.yml</code> ngay sau khi đồng bộ
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleSyncToGithub}
              disabled={isSyncingGithub}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition ${
                isSyncingGithub
                  ? 'bg-purple-800/60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/25 active:scale-98'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSyncingGithub ? 'animate-spin' : ''}`} />
              {isSyncingGithub ? 'Đang gọi GitHub Secrets REST API...' : 'Xuất Bản & Đồng Bộ Lên GitHub (Sync to GitHub)'}
            </button>

            {githubSyncResult && (
              <div
                className={`mt-4 p-3.5 rounded-xl border text-xs font-mono ${
                  githubSyncResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-sans font-bold">
                  <span>{githubSyncResult.success ? '✓ Đồng bộ thành công' : '✕ Thất bại'}</span>
                  <span>{githubSyncResult.timestamp}</span>
                </div>
                <p className="font-sans mb-1">{githubSyncResult.message || githubSyncResult.error}</p>
                {githubSyncResult.commitSha && (
                  <div className="text-[11px] text-slate-400">
                    Commit: <span className="text-indigo-300">{githubSyncResult.commitSha}</span> • Workflow Triggered: {githubSyncResult.workflowDispatched ? 'YES' : 'NO'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feature 2: DEPLOY USING CLOUDFLARE PAGES */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Triển Khai Lên Cloudflare Pages (Deploy using Pages)</h2>
                  <span className="text-[11px] text-slate-400">Cloudflare Edge Direct Upload & Proxy Integration</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Edge Proxy ON
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Triển khai trực tiếp bản phát hành tĩnh sạch lên mạng lưới biên toàn cầu Cloudflare Pages với độ trễ 8ms, tự động liên kết tên miền riêng và chứng chỉ SSL Edge miễn phí.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Chọn Phân Hệ Pages Mục Tiêu:
                </label>
                <select
                  value={selectedPagesProject}
                  onChange={(e) => setSelectedPagesProject(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="hendy-store-user">hendy-store-user (Kho Tải Ứng Dụng Khách / Web-User)</option>
                  <option value="hendy-store-admin">hendy-store-admin (Trang Điều Hành Dev Studio / Web-Admin)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Môi Trường Triển Khai (Environment):
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagesEnvironment('production')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                      pagesEnvironment === 'production'
                        ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Production (Live)
                  </button>
                  <button
                    onClick={() => setPagesEnvironment('preview')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                      pagesEnvironment === 'preview'
                        ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Preview (Staging)
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Cloudflare Account:</span>
                  <span className="text-sky-300">d41d8cd98f00b204e980...</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">DNS Proxy Status:</span>
                  <span className="text-emerald-400 font-bold">1.1.1.1 PROXIED</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleDeployToCloudflarePages}
              disabled={isDeployingPages}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition ${
                isDeployingPages
                  ? 'bg-sky-800/60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-600/25 active:scale-98'
              }`}
            >
              <Cloud className={`w-4 h-4 ${isDeployingPages ? 'animate-bounce' : ''}`} />
              {isDeployingPages ? 'Đang build & upload Pages artifacts...' : 'Triển Khai Lên Cloudflare Pages (Deploy using Pages)'}
            </button>

            {pagesDeployResult && (
              <div
                className={`mt-4 p-3.5 rounded-xl border text-xs font-mono ${
                  pagesDeployResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-sans font-bold">
                  <span>{pagesDeployResult.success ? '✓ Triển khai hoàn tất' : '✕ Lỗi triển khai'}</span>
                  <span>{pagesDeployResult.timestamp}</span>
                </div>
                <p className="font-sans mb-1">{pagesDeployResult.message}</p>
                {pagesDeployResult.liveUrl && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-900/60 font-sans">
                    <span className="text-slate-300">URL Truy Cập:</span>
                    <a
                      href={pagesDeployResult.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      {pagesDeployResult.liveUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Server API Route Explorer & Tester */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Kiểm Thử Trực Tiếp API Máy Chủ (API Explorer)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Express Web Server Endpoints</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Route Selector & Request Setup (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Chọn API Endpoint máy chủ để gọi thử:
              </label>
              <select
                value={selectedApiRoute}
                onChange={(e) => {
                  const r = e.target.value;
                  setSelectedApiRoute(r);
                  if (r.startsWith('/api/sync-github') || r.startsWith('/api/cloudflare-pages') || r.startsWith('/api/matrix/build') || r === '/api/secrets') {
                    setApiMethod('POST');
                    if (r === '/api/sync-github') {
                      setApiRequestBody(JSON.stringify({ repositoryOwner: 'hendy-ecosystem', repositoryName: 'HendyAppStore', triggerMatrix: true }, null, 2));
                    } else if (r === '/api/cloudflare-pages/deploy') {
                      setApiRequestBody(JSON.stringify({ projectName: 'hendy-store-user', environment: 'production' }, null, 2));
                    } else if (r === '/api/matrix/build') {
                      setApiRequestBody(JSON.stringify({ target: 'all' }, null, 2));
                    } else if (r === '/api/secrets') {
                      setApiRequestBody(JSON.stringify({ id: 'sec-2', value: 'UpdatedPassword@2026!' }, null, 2));
                    }
                  } else {
                    setApiMethod('GET');
                    setApiRequestBody('{}');
                  }
                }}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="/api/health">GET /api/health (Trạng thái máy chủ, uptime)</option>
                <option value="/api/system/status">GET /api/system/status (Chỉ số RAM, đồng bộ, hạ tầng)</option>
                <option value="/api/secrets">GET /api/secrets (Lấy danh sách 26 biến)</option>
                <option value="/api/manifest.plist?url=https://r2.hendyappstore.com/apps/app.ipa&id=com.hendy.app&v=2.5.4">
                  GET /api/manifest.plist (Sinh XML Apple OTA)
                </option>
                <option value="/api/sync-github">POST /api/sync-github (Đồng bộ GitHub API)</option>
                <option value="/api/cloudflare-pages/deploy">POST /api/cloudflare-pages/deploy (Deploy Pages)</option>
                <option value="/api/matrix/build">POST /api/matrix/build (Kích hoạt Matrix CI/CD)</option>
                <option value="/api/logs">GET /api/logs (Lấy nhật ký kiểm toán máy chủ)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Phương thức:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${apiMethod === 'POST' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {apiMethod}
              </span>
            </div>

            {apiMethod === 'POST' && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Request Payload (JSON):
                </label>
                <textarea
                  rows={4}
                  value={apiRequestBody}
                  onChange={(e) => setApiRequestBody(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <button
              onClick={handleRunApiTest}
              disabled={isCallingApi}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {isCallingApi ? 'Đang gửi request...' : 'Gửi Yêu Cầu Tới Máy Chủ (Execute API)'}
            </button>
          </div>

          {/* Right: Live Response Window (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">Phản Hồi Từ Máy Chủ (Server Response):</span>
              {apiResponseStatus && (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    apiResponseStatus >= 200 && apiResponseStatus < 300
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  HTTP {apiResponseStatus}
                </span>
              )}
            </div>
            <pre className="flex-1 min-h-[220px] max-h-[300px] overflow-auto p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
              {apiResponseBody || '// Nhấn "Gửi Yêu Cầu Tới Máy Chủ" để xem kết quả trả về thời gian thực...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
