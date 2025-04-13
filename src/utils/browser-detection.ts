
/**
 * Utility to detect browser and platform information
 */
export const detectBrowser = () => {
  const ua = navigator.userAgent;
  return {
    isIOS: /iPad|iPhone|iPod/.test(ua),
    isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
    isAndroid: /Android/.test(ua),
    isFirefox: /Firefox/.test(ua),
    isChromeForIOS: /CriOS/.test(ua),
    isWindowsPhone: /Windows Phone/.test(ua),
    isOpera: /OPR/.test(ua) || /Opera/.test(ua),
    isSamsung: /SamsungBrowser/.test(ua),
    isInStandaloneMode: () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
  };
};
