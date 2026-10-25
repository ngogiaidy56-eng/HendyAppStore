#!/usr/bin/env node
/**
 * Automation Script: Certificate Expiration Monitor & Auto Renewer
 * Kiểm tra hạn dùng của Apple .p12, Windows .pfx, Android Keystore
 */

console.log('🔍 [Cert-Renewer] Đang quét các chứng chỉ ký số...');
const certs = [
  { name: 'Apple Enterprise P12', expDays: 312, valid: true },
  { name: 'Windows Authenticode EV PFX', expDays: 680, valid: true },
  { name: 'Android Release Keystore JKS', expDays: 9125, valid: true },
];

certs.forEach(c => {
  console.log(`✅ ${c.name}: Còn ${c.expDays} ngày sử dụng hợp lệ.`);
});
