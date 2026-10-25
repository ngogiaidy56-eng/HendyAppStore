/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { detectDeviceFromUserAgent } from './deviceDetect';
import { generateIosManifestXml, buildItmsServicesUrl } from './iosManifest';
import { INITIAL_26_SECRETS, validateBase64, validateSecret } from './secrets26';

test('device detection: correctly identifies iPhone iOS user agent', () => {
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
  const info = detectDeviceFromUserAgent(ua);
  assert.equal(info.type, 'ios');
  assert.equal(info.isMobile, true);
  assert.equal(info.recommendedArtifact, 'ipa');
});

test('device detection: correctly identifies Android user agent', () => {
  const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 9 Pro Build/AD1A.240530.030) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.122 Mobile Safari/537.36';
  const info = detectDeviceFromUserAgent(ua);
  assert.equal(info.type, 'android');
  assert.equal(info.isMobile, true);
  assert.equal(info.recommendedArtifact, 'apk');
});

test('device detection: correctly identifies Windows 11 PC user agent', () => {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0';
  const info = detectDeviceFromUserAgent(ua);
  assert.equal(info.type, 'windows');
  assert.equal(info.isMobile, false);
  assert.equal(info.recommendedArtifact, 'exe');
});

test('iOS OTA manifest generator: creates valid plist structure', () => {
  const xml = generateIosManifestXml({
    ipaUrl: 'https://r2.hendyappstore.com/apps/hendy-v2.ipa',
    bundleId: 'com.hendy.appstore',
    bundleVersion: '2.4.0',
    title: 'Hendy App Store',
  });

  assert.ok(xml.includes('<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"'));
  assert.ok(xml.includes('<string>com.hendy.appstore</string>'));
  assert.ok(xml.includes('<string>https://r2.hendyappstore.com/apps/hendy-v2.ipa</string>'));
  assert.ok(xml.includes('<string>software-package</string>'));
});

test('itms-services link builder: formats Apple OTA installation protocol', () => {
  const plistUrl = 'https://hendyappstore.com/api/manifest.plist?appId=hendy-v2';
  const itms = buildItmsServicesUrl(plistUrl);
  assert.ok(itms.startsWith('itms-services://?action=download-manifest&url='));
  assert.ok(itms.includes(encodeURIComponent(plistUrl)));
});

test('secrets manager: ensures all 26 distinct secrets are defined', () => {
  assert.equal(INITIAL_26_SECRETS.length, 26);
  const keys = new Set(INITIAL_26_SECRETS.map(s => s.key));
  assert.equal(keys.size, 26, 'Must contain exactly 26 unique secret keys');

  // Verify critical keys from user prompt
  assert.ok(keys.has('ANDROID_KEYSTORE_BASE64'));
  assert.ok(keys.has('KEYSTORE_PASSWORD'));
  assert.ok(keys.has('KEY_ALIAS'));
  assert.ok(keys.has('KEY_PASSWORD'));
  assert.ok(keys.has('IOS_CERTIFICATE_P12_BASE64'));
  assert.ok(keys.has('CERTIFICATE_PASSWORD'));
  assert.ok(keys.has('PROVISION_PROFILE_BASE64'));
  assert.ok(keys.has('SIGNING_IDENTITY'));
  assert.ok(keys.has('WINDOWS_CERT_PFX_BASE64'));
  assert.ok(keys.has('WINDOWS_CERT_PASSWORD'));
  assert.ok(keys.has('CF_ACCESS_AUD'));
  assert.ok(keys.has('LLM_API_KEY'));
  assert.ok(keys.has('DISCORD_WEBHOOK_URL'));
  assert.ok(keys.has('ALLOWED_ORIGINS'));
  assert.ok(keys.has('D1_DATABASE_ID'));
});

test('validation: Base64 and empty secret verification', () => {
  assert.equal(validateBase64(''), false);
  assert.equal(validateBase64('SGVsbG8gV29ybGQ='), true);
  assert.equal(validateBase64('Not Valid Base64!'), false);

  const validSec = INITIAL_26_SECRETS[0];
  const resValid = validateSecret(validSec);
  assert.equal(resValid.valid, true);

  const emptySec = { ...validSec, value: '' };
  const resInvalid = validateSecret(emptySec);
  assert.equal(resInvalid.valid, false);
});
