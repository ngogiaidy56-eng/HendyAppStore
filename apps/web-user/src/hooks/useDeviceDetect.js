/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Hook tự động nhận diện thiết bị khách (iOS, Android, Windows, MacOS)
 */
import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [device, setDevice] = useState({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMac: false,
    osName: 'Detecting...',
    recommendedArtifact: 'apk'
  });

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isWindows = /windows|win32|win64/.test(ua);
    const isMac = /macintosh|mac os x/.test(ua) && !isIOS;
    const isMobile = isIOS || isAndroid || /mobile/.test(ua);

    let osName = 'Desktop';
    let recommendedArtifact = 'exe';

    if (isIOS) {
      osName = 'iOS';
      recommendedArtifact = 'ipa';
    } else if (isAndroid) {
      osName = 'Android';
      recommendedArtifact = 'apk';
    } else if (isWindows) {
      osName = 'Windows';
      recommendedArtifact = 'exe';
    } else if (isMac) {
      osName = 'macOS';
      recommendedArtifact = 'dmg';
    }

    setDevice({
      isMobile,
      isIOS,
      isAndroid,
      isWindows,
      isMac,
      osName,
      recommendedArtifact
    });
  }, []);

  return device;
}
