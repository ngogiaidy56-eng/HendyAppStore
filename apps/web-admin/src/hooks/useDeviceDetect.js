/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tách luồng: Phone (Mobile CMS Pocket) vs PC (Full Dev Studio)
 */
import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [device, setDevice] = useState({
    isMobile: false,
    mode: 'FullDevStudio'
  });

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|mobile/.test(ua);
    setDevice({
      isMobile,
      mode: isMobile ? 'MobileCMSPocket' : 'FullDevStudio'
    });
  }, []);

  return device;
}
