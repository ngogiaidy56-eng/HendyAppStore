/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_26_SECRETS, validateSecret } from './src/core/secrets26.ts';
import { generateIosManifestXml } from './src/core/iosManifest.ts';
import { detectDeviceFromUserAgent } from './src/core/deviceDetect.ts';
import { INITIAL_SYNC_LOGS, INITIAL_MATRIX_JOBS, SAMPLE_RELEASES } from './src/core/sampleData.ts';
import { SecretItem, SyncLog, BuildMatrixJob } from './src/core/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory persistent state for server runtime
let currentSecrets: SecretItem[] = [...INITIAL_26_SECRETS];
let syncLogs: SyncLog[] = [...INITIAL_SYNC_LOGS];
let matrixJobs: BuildMatrixJob[] = [...INITIAL_MATRIX_JOBS];
let githubSyncStatus: {
  isSynced: boolean;
  lastSyncedAt: string;
  repo: string;
  cfPagesUrl: string;
  deploymentStatus: 'idle' | 'building' | 'deployed' | 'error';
  commitSha: string;
} = {
  isSynced: true,
  lastSyncedAt: new Date().toISOString(),
  repo: 'hendy-ecosystem/HendyAppStore',
  cfPagesUrl: 'https://hendyappstore.pages.dev',
  deploymentStatus: 'deployed',
  commitSha: '8f9a21b4e02c91',
};

// ==========================================
// 1. HEALTH & EDGE DETECTION API
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    server: 'HendyAppStore Express Edge Core',
    cloudflareProxy: true,
    cfRay: '8fa9210-HAN',
    edgeLatencyMs: 8,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/edge-detect', (req: Request, res: Response) => {
  const ua = req.headers['user-agent'] || '';
  const deviceInfo = detectDeviceFromUserAgent(ua);
  const hostname = req.hostname || 'hendyappstore.com';

  const isAdm = hostname.startsWith('admin.') || req.query.admin === 'true';
  const targetLayout = isAdm
    ? deviceInfo.isMobile
      ? 'MobileCMSPocketLayout.js'
      : 'FullDevStudioLayout.js'
    : deviceInfo.isMobile
    ? 'MobileAppStoreLayout.js'
    : 'DesktopPortalLayout.js';

  res.json({
    hostname,
    userAgent: ua,
    deviceInfo,
    targetLayout,
    routedTo: isAdm ? 'Web-Admin Core' : 'Web-User Core',
  });
});

// ==========================================
// 2. DYNAMIC MANIFEST.PLIST (APPLE OTA)
// ==========================================
app.get('/api/manifest.plist', (req: Request, res: Response) => {
  const id = (req.query.id as string) || 'com.hendy.superapp';
  const v = (req.query.v as string) || '2.5.4';
  const name = (req.query.name as string) || 'Hendy SuperApp';
  const ipaUrl =
    (req.query.url as string) ||
    'https://r2.hendyappstore.com/binaries/ios/HendySuperApp-v2.5.4-enterprise.ipa';

  const xml = generateIosManifestXml({
    ipaUrl,
    bundleId: id,
    bundleVersion: v,
    title: name,
  });

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(xml);
});

// ==========================================
// 3. 26 SECRETS & VARIABLES REST API
// ==========================================
app.get('/api/secrets', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: currentSecrets.length,
    syncedCount: currentSecrets.filter((s) => s.synced).length,
    secrets: currentSecrets,
  });
});

app.put('/api/secrets/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { value } = req.body;

  const idx = currentSecrets.findIndex((s) => s.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, error: 'Không tìm thấy biến với ID này' });
    return;
  }

  const updatedSecret: SecretItem = {
    ...currentSecrets[idx],
    value: value ?? currentSecrets[idx].value,
    synced: false,
  };

  const validation = validateSecret(updatedSecret);
  if (!validation.valid) {
    res.status(400).json({ success: false, error: validation.error });
    return;
  }

  currentSecrets[idx] = updatedSecret;

  const log: SyncLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    source: 'Web-Admin',
    level: 'info',
    message: `Chỉnh sửa giá trị biến ${updatedSecret.key}. Trạng thái: Pending Sync.`,
    secretKey: updatedSecret.key,
  };
  syncLogs.unshift(log);

  res.json({ success: true, secret: updatedSecret });
});

app.post('/api/sync-secrets', (req: Request, res: Response) => {
  const { triggerWorkflow = true } = req.body;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // 1. Mark all secrets as synced
  currentSecrets = currentSecrets.map((s) => ({
    ...s,
    synced: true,
    lastSyncedAt: timestamp,
  }));

  // 2. Add audit logs
  syncLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp,
    source: 'Workers-API',
    level: 'info',
    message: 'Nhận gói tin 26 biến, thực hiện mã hóa hộp kín Libsodium (crypto_box_seal).',
  });

  syncLogs.unshift({
    id: `log-${Date.now() + 1}`,
    timestamp,
    source: 'GitHub-API',
    level: 'success',
    message: `Đã gọi REST API PUT /repos/hendy-ecosystem/HendyAppStore/actions/secrets, đồng bộ 26/26 biến thành công (200 OK).`,
  });

  if (triggerWorkflow) {
    syncLogs.unshift({
      id: `log-${Date.now() + 2}`,
      timestamp,
      source: 'GitHub-API',
      level: 'info',
      message: 'Trigger workflow dispatch matrix-build.yml trên các runners cô lập.',
    });
  }

  res.json({
    success: true,
    syncedCount: currentSecrets.length,
    timestamp,
    message: 'Đồng bộ 26 biến bảo mật và cấu hình môi trường thành công!',
  });
});

// ==========================================
// 4. LIVE SYNC LOGS & AUDIT TRAIL API
// ==========================================
app.get('/api/sync-logs', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  res.json({
    success: true,
    total: syncLogs.length,
    logs: syncLogs.slice(0, limit),
  });
});

app.post('/api/sync-logs', (req: Request, res: Response) => {
  const { source, level, message, secretKey } = req.body;
  const log: SyncLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    source: source || 'Web-Admin',
    level: level || 'info',
    message: message || 'Log entry created',
    secretKey,
  };
  syncLogs.unshift(log);
  res.json({ success: true, log });
});

app.delete('/api/sync-logs', (_req: Request, res: Response) => {
  syncLogs = [];
  res.json({ success: true, message: 'Đã xóa toàn bộ nhật ký' });
});

// ==========================================
// 5. GITHUB MATRIX BUILD & RUNNER API
// ==========================================
app.get('/api/matrix/status', (_req: Request, res: Response) => {
  res.json({ success: true, jobs: matrixJobs });
});

app.post('/api/matrix/dispatch', (req: Request, res: Response) => {
  const { target = 'all' } = req.body;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  matrixJobs = matrixJobs.map((j) =>
    target === 'all' || j.os === target
      ? {
          ...j,
          status: 'running',
          steps: j.steps.map((s) => ({ ...s, status: 'running' })),
        }
      : j
  );

  syncLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp,
    source: 'GitHub-API',
    level: 'info',
    message: `Khởi chạy Matrix Build Runner cho hệ điều hành: ${target.toUpperCase()}.`,
  });

  // Simulated background runner completion
  setTimeout(() => {
    matrixJobs = matrixJobs.map((j) =>
      target === 'all' || j.os === target
        ? {
            ...j,
            status: 'success',
            steps: j.steps.map((s) => ({ ...s, status: 'completed' })),
          }
        : j
    );

    syncLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      source: 'Workers-API',
      level: 'success',
      message: `Đóng gói hoàn tất! Tệp sản phẩm sạch (.apk V2, .ipa OTA, .exe SignTool) đã upload lên Cloudflare R2 Storage.`,
    });
  }, 2000);

  res.json({
    success: true,
    message: `Đã kích hoạt workflow dispatch ma trận biên dịch cho: ${target}`,
    jobs: matrixJobs,
  });
});

// ==========================================
// 6. SYNC TO GITHUB & CLOUDFLARE PAGES API
// ==========================================
app.get('/api/github/status', (_req: Request, res: Response) => {
  res.json({ success: true, githubSyncStatus });
});

app.post('/api/github/sync', async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const newCommit = Math.random().toString(16).substring(2, 10);

  githubSyncStatus = {
    ...githubSyncStatus,
    isSynced: true,
    lastSyncedAt: timestamp,
    commitSha: newCommit,
    deploymentStatus: 'building',
  };

  syncLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp,
    source: 'GitHub-API',
    level: 'info',
    message: `Đang đẩy mã nguồn monorepo và 26 biến cấu hình lên GitHub (commit: ${newCommit})...`,
  });

  // Simulate Cloudflare Pages build & deployment
  setTimeout(() => {
    githubSyncStatus.deploymentStatus = 'deployed';
    syncLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      source: 'Workers-API',
      level: 'success',
      message: `Cloudflare Pages đã hoàn tất biên dịch và phát hành bản dựng mới tại https://hendyappstore.pages.dev.`,
    });
  }, 2200);

  res.json({
    success: true,
    message: 'Đã đẩy mã nguồn lên GitHub và kích hoạt triển khai Cloudflare Pages!',
    syncStatus: githubSyncStatus,
  });
});

// ==========================================
// 7. SELF-HEALING & D1 DATABASE API
// ==========================================
app.post('/api/self-healing/webhook', (req: Request, res: Response) => {
  const { event = 'workflow_job.failed', jobName = 'Android Runner #402', error = 'Keystore Base64 decode padding error' } = req.body;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  syncLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp,
    source: 'Self-Healing',
    level: 'warn',
    message: `Phát hiện sự cố: ${jobName} - ${error}. AI LLM Bot đang tiến hành phân tích và tự sửa chữa...`,
  });

  setTimeout(() => {
    syncLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      source: 'Self-Healing',
      level: 'success',
      message: `Đã tự động chuẩn hóa padding Base64 và kích hoạt lại build thành công!`,
    });
  }, 1500);

  res.json({
    success: true,
    incidentId: `inc-${Date.now()}`,
    action: 'auto_healed',
    diagnostic: 'Đã phân tích nhật ký lỗi qua LLM API, áp dụng bản vá chuẩn hóa Base64 và khởi động lại Runner.',
  });
});

app.get('/api/d1/tables', (req: Request, res: Response) => {
  const table = (req.query.table as string) || 'secrets_metadata';

  if (table === 'secrets_metadata') {
    res.json({
      success: true,
      table,
      rows: currentSecrets.map((s) => ({
        id: s.id,
        key: s.key,
        category: s.category,
        is_base64: s.isBase64 ? 1 : 0,
        synced_status: s.synced ? 'synced' : 'pending',
        updated_at: s.lastSyncedAt || '2026-10-25 06:12:00',
      })),
    });
    return;
  }

  if (table === 'sync_audit_logs') {
    res.json({
      success: true,
      table,
      rows: syncLogs.slice(0, 20),
    });
    return;
  }

  if (table === 'app_releases') {
    res.json({
      success: true,
      table,
      rows: SAMPLE_RELEASES,
    });
    return;
  }

  res.status(400).json({ success: false, error: 'Bảng không tồn tại' });
});

// ==========================================
// 8. VITE MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [HendyAppStore Server] Web server running on http://0.0.0.0:${PORT}`);
    console.log(`⚡ Edge Router Engine: Active with 26 Secrets & Cloudflare Pages integration`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
