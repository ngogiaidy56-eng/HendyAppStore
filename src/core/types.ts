/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DeviceType = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
export type AppTargetOS = 'ios' | 'android' | 'windows' | 'all';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  osName: string;
  browser: string;
  recommendedArtifact: 'ipa' | 'apk' | 'exe' | 'dmg';
}

export type SecretCategory =
  | 'android_keystore'
  | 'ios_provisioning'
  | 'windows_signtool'
  | 'cloudflare_infra'
  | 'github_sync'
  | 'security_observability';

export interface SecretItem {
  id: string;
  key: string;
  label: string;
  category: SecretCategory;
  description: string;
  value: string;
  isSecret: boolean;
  isBase64: boolean;
  synced: boolean;
  lastSyncedAt?: string;
  validationError?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  source: 'Web-Admin' | 'Workers-API' | 'GitHub-API' | 'Edge-Router' | 'Self-Healing';
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  secretKey?: string;
  details?: Record<string, unknown>;
}

export interface BuildMatrixJob {
  id: string;
  os: 'android' | 'ios' | 'windows';
  title: string;
  status: 'idle' | 'queued' | 'running' | 'success' | 'failed';
  durationSeconds: number;
  outputArtifact: string;
  fileSize: string;
  signatureStandard: string;
  sha256: string;
  steps: {
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    log: string;
  }[];
}

export interface AppRelease {
  id: string;
  name: string;
  version: string;
  buildNumber: number;
  updatedAt: string;
  icon: string;
  summary: string;
  description: string;
  downloads: number;
  rating: number;
  size: string;
  bundleId: string;
  developer: string;
  artifacts: {
    android: {
      apkUrl: string;
      packageName: string;
      sha256: string;
      minSdk: number;
      targetSdk: number;
      signatureVersion: 'V2+V3 Signed';
      proguardHash: string;
    };
    ios: {
      ipaUrl: string;
      bundleId: string;
      manifestPlistUrl: string;
      signingIdentity: string;
      expirationDate: string;
      isEnterprise: boolean;
    };
    windows: {
      exeUrl: string;
      version: string;
      publisher: string;
      sha256: string;
      smartScreenVerified: boolean;
    };
  };
}
