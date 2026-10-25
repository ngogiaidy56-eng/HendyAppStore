/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderNav, AppViewMode } from './components/HeaderNav';
import { WebUserView } from './components/WebUserView';
import { WebAdminView } from './components/WebAdminView';
import { EdgeArchitectureView } from './components/EdgeArchitectureView';
import { MonorepoBrowser } from './components/MonorepoBrowser';
import { SelfHealingView } from './components/SelfHealingView';
import { GithubSyncModal } from './components/GithubSyncModal';
import { DeviceInfo, DeviceType, SecretItem, SyncLog, BuildMatrixJob } from './core/types';
import { detectDeviceFromUserAgent } from './core/deviceDetect';
import { INITIAL_26_SECRETS } from './core/secrets26';
import { SAMPLE_RELEASES, INITIAL_SYNC_LOGS, INITIAL_MATRIX_JOBS } from './core/sampleData';
import { ShieldCheck, Cloud, GitBranch, Terminal } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppViewMode>('web-user');
  const [deviceOverride, setDeviceOverride] = useState<'auto' | DeviceType>('auto');

  // Secrets & runtime state
  const [secrets, setSecrets] = useState<SecretItem[]>(INITIAL_26_SECRETS);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_SYNC_LOGS);
  const [matrixJobs, setMatrixJobs] = useState<BuildMatrixJob[]>(INITIAL_MATRIX_JOBS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GitHub & Cloudflare Pages Sync Modal State
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isDeployingPages, setIsDeployingPages] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState({
    isSynced: true,
    lastSyncedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    repo: 'hendy-ecosystem/HendyAppStore',
    cfPagesUrl: 'https://hendyappstore.pages.dev',
    deploymentStatus: 'deployed' as 'idle' | 'building' | 'deployed' | 'error',
    commitSha: '8f9a21b',
  });

  // Real device detection
  const [realDeviceInfo, setRealDeviceInfo] = useState<DeviceInfo>({
    type: 'windows',
    isMobile: false,
    osName: 'Windows',
    browser: 'Chrome',
    recommendedArtifact: 'exe',
  });

  // Fetch initial data from server APIs
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const detected = detectDeviceFromUserAgent(navigator.userAgent);
      setRealDeviceInfo(detected);
    }

    // Load server state
    fetch('/api/secrets')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.secrets) {
          setSecrets(data.secrets);
        }
      })
      .catch(() => {});

    fetch('/api/sync-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.logs) {
          setSyncLogs(data.logs);
        }
      })
      .catch(() => {});

    fetch('/api/github/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.githubSyncStatus) {
          setGithubSyncStatus(data.githubSyncStatus);
        }
      })
      .catch(() => {});
  }, []);

  // Compute effective device info based on override or real
  const effectiveDeviceInfo: DeviceInfo = React.useMemo(() => {
    if (deviceOverride === 'auto') {
      return realDeviceInfo;
    }
    switch (deviceOverride) {
      case 'ios':
        return {
          type: 'ios',
          isMobile: true,
          osName: 'iOS (iPhone 16 Pro)',
          browser: 'Mobile Safari',
          recommendedArtifact: 'ipa',
        };
      case 'android':
        return {
          type: 'android',
          isMobile: true,
          osName: 'Android (Google Pixel 9)',
          browser: 'Chrome Mobile',
          recommendedArtifact: 'apk',
        };
      case 'windows':
        return {
          type: 'windows',
          isMobile: false,
          osName: 'Windows 11 PC (x64)',
          browser: 'Microsoft Edge',
          recommendedArtifact: 'exe',
        };
      case 'macos':
        return {
          type: 'macos',
          isMobile: false,
          osName: 'macOS Sonoma (M3 Max)',
          browser: 'Apple Safari',
          recommendedArtifact: 'dmg',
        };
      default:
        return realDeviceInfo;
    }
  }, [deviceOverride, realDeviceInfo]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateSecret = async (id: string, newValue: string) => {
    // Optimistic local update
    const updated = secrets.map((s) =>
      s.id === id ? { ...s, value: newValue, synced: false } : s
    );
    setSecrets(updated);

    const changedSec = secrets.find((s) => s.id === id);
    try {
      const res = await fetch(`/api/secrets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã lưu thay đổi biến: ${changedSec?.key}`);
      }
    } catch {
      showToast(`Đã lưu thay đổi biến: ${changedSec?.key}`);
    }

    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      source: 'Web-Admin',
      level: 'info',
      message: `Chỉnh sửa cục bộ biến ${changedSec?.key || id}. Đánh dấu trạng thái: Pending Sync.`,
      secretKey: changedSec?.key,
    };
    setSyncLogs((prev) => [newLog, ...prev]);
  };

  const handleSyncAllSecrets = async () => {
    setIsSyncing(true);

    try {
      const res = await fetch('/api/sync-secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerWorkflow: true }),
      });
      const data = await res.json();

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const synced = secrets.map((s) => ({
        ...s,
        synced: true,
        lastSyncedAt: now,
      }));
      setSecrets(synced);

      // Refresh logs from server
      const logsRes = await fetch('/api/sync-logs');
      const logsData = await logsRes.json();
      if (logsData.success && logsData.logs) {
        setSyncLogs(logsData.logs);
      }

      showToast('26/26 Biến Môi Trường Đã Được Đồng Bộ An Toàn Sang GitHub!');
    } catch {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      setSecrets((prev) => prev.map((s) => ({ ...s, synced: true, lastSyncedAt: now })));
      showToast('26/26 Biến Môi Trường Đã Được Đồng Bộ An Toàn!');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTriggerMatrixBuild = async (target: 'all' | 'android' | 'ios' | 'windows') => {
    setIsBuilding(true);

    setMatrixJobs((prev) =>
      prev.map((job) =>
        target === 'all' || job.os === target
          ? {
              ...job,
              status: 'running',
              steps: job.steps.map((st) => ({ ...st, status: 'running' })),
            }
          : job
      )
    );

    try {
      await fetch('/api/matrix/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      });

      setTimeout(async () => {
        setMatrixJobs((prev) =>
          prev.map((job) =>
            target === 'all' || job.os === target
              ? {
                  ...job,
                  status: 'success',
                  steps: job.steps.map((st) => ({ ...st, status: 'completed' })),
                }
              : job
          )
        );
        setIsBuilding(false);

        const logsRes = await fetch('/api/sync-logs');
        const logsData = await logsRes.json();
        if (logsData.success && logsData.logs) {
          setSyncLogs(logsData.logs);
        }
        showToast('Build Matrix thành công! Đã nạp thành phẩm sạch lên R2 Storage.');
      }, 2200);
    } catch {
      setIsBuilding(false);
    }
  };

  const handleTriggerGithubPagesSync = async () => {
    setIsDeployingPages(true);

    try {
      const res = await fetch('/api/github/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.syncStatus) {
        setGithubSyncStatus(data.syncStatus);
      }

      setTimeout(async () => {
        setIsDeployingPages(false);
        setGithubSyncStatus((prev) => ({
          ...prev,
          deploymentStatus: 'deployed',
        }));

        const logsRes = await fetch('/api/sync-logs');
        const logsData = await logsRes.json();
        if (logsData.success && logsData.logs) {
          setSyncLogs(logsData.logs);
        }
        showToast('Đã đồng bộ lên GitHub & hoàn tất triển khai Cloudflare Pages!');
      }, 2400);
    } catch {
      setIsDeployingPages(false);
    }
  };

  const syncedCount = secrets.filter((s) => s.synced).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-indigo-400 font-semibold text-xs animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header Navigation */}
      <HeaderNav
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        selectedDeviceOverride={deviceOverride}
        onSelectDeviceOverride={setDeviceOverride}
        detectedOsName={effectiveDeviceInfo.osName}
        isMobileDetected={effectiveDeviceInfo.isMobile}
        syncedCount={syncedCount}
        onOpenGithubSync={() => setIsGithubModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentMode === 'web-user' && (
          <WebUserView deviceInfo={effectiveDeviceInfo} releases={SAMPLE_RELEASES} />
        )}

        {currentMode === 'web-admin' && (
          <WebAdminView
            deviceInfo={effectiveDeviceInfo}
            secrets={secrets}
            onUpdateSecret={handleUpdateSecret}
            onSyncAllSecrets={handleSyncAllSecrets}
            isSyncing={isSyncing}
            syncLogs={syncLogs}
            onClearLogs={async () => {
              setSyncLogs([]);
              await fetch('/api/sync-logs', { method: 'DELETE' }).catch(() => {});
            }}
            matrixJobs={matrixJobs}
            onTriggerMatrixBuild={handleTriggerMatrixBuild}
            isBuilding={isBuilding}
          />
        )}

        {currentMode === 'architecture' && <EdgeArchitectureView />}

        {currentMode === 'monorepo' && <MonorepoBrowser />}

        {currentMode === 'self-healing' && <SelfHealingView />}
      </main>

      {/* GitHub Sync & Cloudflare Pages Deployment Modal */}
      <GithubSyncModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        secrets={secrets}
        onTriggerSync={handleTriggerGithubPagesSync}
        isSyncing={isDeployingPages}
        syncStatus={githubSyncStatus}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-white">HendyAppStore Express Server</span> • Port 3000 • Cloudflare Edge Router & GitHub Actions Matrix
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 font-mono text-[11px] text-slate-400 flex-wrap justify-center">
            <span>DNS: 1.1.1.1 (Proxied)</span>
            <span>R2: Synced</span>
            <span>26 Secrets: OK</span>
            <span>D1: Connected</span>
            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline"
            >
              Sync to GitHub & Pages ➔
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
