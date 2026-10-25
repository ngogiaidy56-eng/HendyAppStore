/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeviceInfo, DeviceType } from './types';

export function detectDeviceFromUserAgent(uaString: string): DeviceInfo {
  const ua = uaString.toLowerCase();

  let type: DeviceType = 'unknown';
  let isMobile = false;
  let osName = 'Unknown OS';
  let recommendedArtifact: 'ipa' | 'apk' | 'exe' | 'dmg' = 'exe';

  if (/iphone|ipad|ipod/.test(ua)) {
    type = 'ios';
    isMobile = true;
    osName = /ipad/.test(ua) ? 'iPadOS' : 'iOS';
    recommendedArtifact = 'ipa';
  } else if (/android/.test(ua)) {
    type = 'android';
    isMobile = true;
    osName = 'Android';
    recommendedArtifact = 'apk';
  } else if (/windows|win32|win64/.test(ua)) {
    type = 'windows';
    isMobile = false;
    osName = 'Windows 11 / 10';
    recommendedArtifact = 'exe';
  } else if (/macintosh|mac os x/.test(ua)) {
    type = 'macos';
    isMobile = false;
    osName = 'macOS Sonoma / Sequoia';
    recommendedArtifact = 'dmg';
  } else if (/linux/.test(ua)) {
    type = 'linux';
    isMobile = false;
    osName = 'Linux';
    recommendedArtifact = 'apk';
  }

  let browser = 'Browser';
  if (/edg/.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/.test(ua)) browser = 'Google Chrome';
  else if (/safari/.test(ua) && !/chrome/.test(ua)) browser = 'Apple Safari';
  else if (/firefox|fxios/.test(ua)) browser = 'Mozilla Firefox';

  return {
    type,
    isMobile,
    osName,
    browser,
    recommendedArtifact,
  };
}

export function getPlatformBadgeColor(type: DeviceType): { bg: string; text: string; border: string } {
  switch (type) {
    case 'ios':
      return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' };
    case 'android':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    case 'windows':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
    case 'macos':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
  }
}
