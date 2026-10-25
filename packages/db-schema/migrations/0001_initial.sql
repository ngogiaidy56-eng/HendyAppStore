-- Cloudflare D1 Serverless SQL Migration: 0001_initial.sql
-- Quản lý toàn bộ vòng đời biến môi trường, nhật ký đồng bộ và bản phát hành App

CREATE TABLE IF NOT EXISTS secrets_metadata (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  is_base64 INTEGER DEFAULT 0,
  synced_status TEXT DEFAULT 'pending',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_checksum TEXT
);

CREATE TABLE IF NOT EXISTS sync_audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  affected_keys TEXT,
  raw_response TEXT
);

CREATE TABLE IF NOT EXISTS app_releases (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  build_number INTEGER NOT NULL,
  platform TEXT NOT NULL,
  artifact_path TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  signature_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_secrets_category ON secrets_metadata(category);
CREATE INDEX IF NOT EXISTS idx_releases_platform ON app_releases(platform);
