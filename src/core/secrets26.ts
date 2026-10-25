/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecretCategory, SecretItem } from './types';

export const INITIAL_26_SECRETS: SecretItem[] = [
  // 1. Android Keystore (4 variables)
  {
    id: 'sec-1',
    key: 'ANDROID_KEYSTORE_BASE64',
    label: 'Android Keystore (Base64)',
    category: 'android_keystore',
    description: 'Chuỗi Base64 tệp tin keystore (.jks) dùng cho apksigner ký số V2/V3',
    value: 'MIIDuDCCAqCgAwIBAgIEVgRzRjANBgkqhkiG9w0BAQsFADBhMQswCQYDVQQGEwJW...[SECURE_JKS_ENCODED]',
    isSecret: true,
    isBase64: true,
    synced: true,
    lastSyncedAt: '2026-10-25 06:12:00',
  },
  {
    id: 'sec-2',
    key: 'KEYSTORE_PASSWORD',
    label: 'Keystore Password',
    category: 'android_keystore',
    description: 'Mật khẩu bảo vệ kho khóa Android Keystore',
    value: 'HendyStore@AndroidKey_2026!',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:12:00',
  },
  {
    id: 'sec-3',
    key: 'KEY_ALIAS',
    label: 'Key Alias',
    category: 'android_keystore',
    description: 'Bí danh (alias) của chứng thư ký phát hành ứng dụng Android',
    value: 'hendy-release-key',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:12:00',
  },
  {
    id: 'sec-4',
    key: 'KEY_PASSWORD',
    label: 'Key Password',
    category: 'android_keystore',
    description: 'Mật khẩu riêng biệt của Key Alias trong Keystore',
    value: 'HendyPass_KeyRelease#999',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:12:00',
  },

  // 2. iOS Provisioning (4 variables)
  {
    id: 'sec-5',
    key: 'IOS_CERTIFICATE_P12_BASE64',
    label: 'iOS Certificate .p12 (Base64)',
    category: 'ios_provisioning',
    description: 'Chứng chỉ Apple Distribution (.p12) mã hóa Base64 cho Fastlane/xcodebuild',
    value: 'MIIKXgIBAzCCCW4GCSqGSIb3DQEHAaCCCV8EggVbMIIFVTCCA...[SECURE_P12_ENCODED]',
    isSecret: true,
    isBase64: true,
    synced: true,
    lastSyncedAt: '2026-10-25 06:15:30',
  },
  {
    id: 'sec-6',
    key: 'CERTIFICATE_PASSWORD',
    label: 'Certificate Password',
    category: 'ios_provisioning',
    description: 'Mật khẩu giải mã chứng chỉ .p12 Apple Developer',
    value: 'AppleP12@EnterpriseDist_2026',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:15:30',
  },
  {
    id: 'sec-7',
    key: 'PROVISION_PROFILE_BASE64',
    label: 'Provisioning Profile (Base64)',
    category: 'ios_provisioning',
    description: 'Tệp tin .mobileprovision mã hóa Base64 để cấp phép cài đặt OTA',
    value: 'MIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADCABgkqhkiG9w0BBw...[SECURE_MOBILEPROVISION]',
    isSecret: true,
    isBase64: true,
    synced: true,
    lastSyncedAt: '2026-10-25 06:15:30',
  },
  {
    id: 'sec-8',
    key: 'SIGNING_IDENTITY',
    label: 'Signing Identity',
    category: 'ios_provisioning',
    description: 'Tên danh tính chứng chỉ ký số Apple (VD: Apple Distribution: Hendy Corp (9X8Y...))',
    value: 'Apple Distribution: Hendy Global Enterprise Corp (8Q9W2E)',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:15:30',
  },

  // 3. Windows SignTool (2 variables)
  {
    id: 'sec-9',
    key: 'WINDOWS_CERT_PFX_BASE64',
    label: 'Windows Cert .pfx (Base64)',
    category: 'windows_signtool',
    description: 'Chứng chỉ ký mã nguồn Windows Authenticode (.pfx) chống cảnh báo SmartScreen',
    value: 'MIIJxAIBAzCCCWwGCSqGSIb3DQEHAaCCCV0EggVZMIIRWDCC...[SECURE_PFX_ENCODED]',
    isSecret: true,
    isBase64: true,
    synced: true,
    lastSyncedAt: '2026-10-25 06:20:11',
  },
  {
    id: 'sec-10',
    key: 'WINDOWS_CERT_PASSWORD',
    label: 'Windows Cert Password',
    category: 'windows_signtool',
    description: 'Mật khẩu giải mã chứng chỉ EV/Code Signing .pfx',
    value: 'WinCodeSign#HendyAuth2026!',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:20:11',
  },

  // 4. Cloudflare Infrastructure (7 variables)
  {
    id: 'sec-11',
    key: 'CF_ACCESS_AUD',
    label: 'CF Access AUD Tag',
    category: 'cloudflare_infra',
    description: 'Audience Tag của Cloudflare Zero Trust Access cho Web-Admin',
    value: '84b9c1d0e5f7a23c89b4e12f90a61c3d7890efab1234567890abcdef12345678',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:22:00',
  },
  {
    id: 'sec-12',
    key: 'CF_ACCOUNT_ID',
    label: 'Cloudflare Account ID',
    category: 'cloudflare_infra',
    description: 'ID tài khoản Cloudflare vận hành Workers, Pages và R2',
    value: 'd41d8cd98f00b204e9800998ecf8427e',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:22:00',
  },
  {
    id: 'sec-13',
    key: 'CF_API_TOKEN',
    label: 'Cloudflare API Token',
    category: 'cloudflare_infra',
    description: 'Token ủy quyền triển khai Pages, Workers và cập nhật DNS Rules',
    value: 'cf_tok_live_79aB1CdEfGhIjKlMnOpQrStUvWxYz0123456',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:22:00',
  },
  {
    id: 'sec-14',
    key: 'CF_ZONE_ID',
    label: 'Cloudflare Zone ID',
    category: 'cloudflare_infra',
    description: 'ID phân vùng DNS của tên miền hendyappstore.com',
    value: '023e105f4ecef8ad9ca31a8372d0c353',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:22:00',
  },
  {
    id: 'sec-15',
    key: 'R2_BUCKET_NAME',
    label: 'Cloudflare R2 Bucket Name',
    category: 'cloudflare_infra',
    description: 'Tên Bucket lưu trữ Binary gốc .apk, .ipa, .exe sạch',
    value: 'hendy-appstore-binaries-prod',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:22:00',
  },
  {
    id: 'sec-16',
    key: 'R2_ACCESS_KEY_ID',
    label: 'R2 S3 Access Key ID',
    category: 'cloudflare_infra',
    description: 'Access Key tương thích S3 API cho GitHub Actions tải tệp',
    value: '9f2a7b8c1d3e5a7b9c1d3e5a7b9c1d3e',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:22:00',
  },
  {
    id: 'sec-17',
    key: 'R2_SECRET_ACCESS_KEY',
    label: 'R2 S3 Secret Access Key',
    category: 'cloudflare_infra',
    description: 'Khóa bí mật S3 API upload binary từ Runner lên R2',
    value: '84b9c1d0e5f7a23c89b4e12f90a61c3d7890efab1234567890abcdef12345678',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:22:00',
  },

  // 5. GitHub CI/CD & Sync (3 variables)
  {
    id: 'sec-18',
    key: 'GITHUB_TOKEN',
    label: 'GitHub PAT (Fine-Grained)',
    category: 'github_sync',
    description: 'Personal Access Token có quyền repo, secrets:write, actions:write',
    value: 'ghp_HendyStoreAutomation99XyZ4812304958349583',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:25:00',
  },
  {
    id: 'sec-19',
    key: 'GITHUB_REPO_OWNER',
    label: 'GitHub Repository Owner',
    category: 'github_sync',
    description: 'Tài khoản hoặc Tổ chức quản lý mã nguồn (Organization/User)',
    value: 'hendy-ecosystem',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:25:00',
  },
  {
    id: 'sec-20',
    key: 'GITHUB_REPO_NAME',
    label: 'GitHub Repository Name',
    category: 'github_sync',
    description: 'Tên kho lưu trữ mã nguồn monorepo trên GitHub',
    value: 'HendyAppStore',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:25:00',
  },

  // 6. Security, AI & Observability (6 variables)
  {
    id: 'sec-21',
    key: 'LLM_API_KEY',
    label: 'LLM API Key (Self-Healing Bot)',
    category: 'security_observability',
    description: 'API Key cấp cho Bot tự vá lỗi và phân tích nhật ký Build Failure',
    value: 'AIzaSyA89v7x2-hendy-llm-selfhealing-agent',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:28:45',
  },
  {
    id: 'sec-22',
    key: 'DISCORD_WEBHOOK_URL',
    label: 'Discord Alert Webhook URL',
    category: 'security_observability',
    description: 'Webhook gửi thông báo thời gian thực về build thành công / thất bại',
    value: 'https://discord.com/api/webhooks/1234567890/hendy-build-matrix-alerts-token',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:28:45',
  },
  {
    id: 'sec-23',
    key: 'ALLOWED_ORIGINS',
    label: 'CORS Allowed Origins',
    category: 'security_observability',
    description: 'Danh sách tên miền được phép gọi API (phân cách bằng dấu phẩy)',
    value: 'https://hendyappstore.com,https://admin.hendyappstore.com,https://*.pages.dev',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:28:45',
  },
  {
    id: 'sec-24',
    key: 'JWT_SECRET',
    label: 'Edge JWT Auth Secret',
    category: 'security_observability',
    description: 'Khóa đối xứng HS256 ký và thẩm định phiên làm việc Admin tại Cloudflare Edge',
    value: 'hendy_jwt_edge_super_secret_key_998877665544332211',
    isSecret: true,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:28:45',
  },
  {
    id: 'sec-25',
    key: 'D1_DATABASE_ID',
    label: 'Cloudflare D1 Database ID',
    category: 'security_observability',
    description: 'UUID của Serverless SQL D1 Database lưu trữ nhật ký đồng bộ & telemetry',
    value: 'e57c6b90-1a2b-4c3d-8e9f-0a1b2c3d4e5f',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:28:45',
  },
  {
    id: 'sec-26',
    key: 'KV_NAMESPACE_ID',
    label: 'Cloudflare KV Namespace ID',
    category: 'security_observability',
    description: 'ID kho khóa-giá trị KV tốc độ cao phục vụ bộ nhớ đệm Edge Router',
    value: '7f9c3a2b1e0d4f5a8b7c6d5e4f3a2b1c',
    isSecret: false,
    isBase64: false,
    synced: true,
    lastSyncedAt: '2026-10-25 06:28:45',
  },
];

export function validateBase64(str: string): boolean {
  if (!str || str.length === 0) return false;
  // If it's a placeholder notation like [SECURE_...], treat as mock valid
  if (str.includes('[SECURE_')) return true;
  // Strip whitespace
  const clean = str.replace(/\s+/g, '');
  if (clean.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(clean);
}

export function validateSecret(secret: SecretItem): { valid: boolean; error?: string } {
  if (!secret.value || secret.value.trim() === '') {
    return { valid: false, error: 'Giá trị biến không được để trống' };
  }
  if (secret.isBase64 && !validateBase64(secret.value)) {
    return { valid: false, error: 'Định dạng Base64 không hợp lệ (cần padding = hoặc ký tự A-Za-z0-9+/)' };
  }
  if (secret.key === 'DISCORD_WEBHOOK_URL' && !secret.value.startsWith('https://discord.com/api/webhooks/')) {
    return { valid: false, error: 'URL Discord Webhook phải bắt đầu bằng https://discord.com/api/webhooks/' };
  }
  return { valid: true };
}

export function getCategoryMetadata(category: SecretCategory) {
  switch (category) {
    case 'android_keystore':
      return {
        title: 'Android Keystore & Ký số V2/V3',
        color: 'emerald',
        badge: 'Android OS',
        iconName: 'Smartphone',
      };
    case 'ios_provisioning':
      return {
        title: 'iOS Certificates & Provisioning OTA',
        color: 'sky',
        badge: 'iOS / Apple',
        iconName: 'Apple',
      };
    case 'windows_signtool':
      return {
        title: 'Windows SignTool Authenticode',
        color: 'blue',
        badge: 'Windows PC',
        iconName: 'Monitor',
      };
    case 'cloudflare_infra':
      return {
        title: 'Hạ tầng Cloudflare (Workers, Pages, R2)',
        color: 'amber',
        badge: 'Cloudflare Edge',
        iconName: 'Cloud',
      };
    case 'github_sync':
      return {
        title: 'GitHub CI/CD & Operations API',
        color: 'purple',
        badge: 'GitHub Matrix',
        iconName: 'GitBranch',
      };
    case 'security_observability':
      return {
        title: 'Bảo mật, AI Self-Healing & Giám sát',
        color: 'rose',
        badge: 'Core Security & Bot',
        iconName: 'ShieldAlert',
      };
  }
}
