
/**
 * Register and check service worker status
 * @returns Promise that resolves with the service worker registration
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  console.log("Attempting to register service worker");
  
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log(`Service Worker registrado com sucesso: ${registration.scope}`);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  } else {
    console.log("Service workers not supported");
  }
  
  return null;
};

/**
 * Check if service worker is registered
 * @returns Promise that resolves with the service worker registration
 */
export const checkServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | undefined> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log("Service worker is registered", registration);
        
        // Diagnóstico adicional sobre o estado do service worker
        if (registration.installing) {
          console.log("Service worker is installing");
        } else if (registration.waiting) {
          console.log("Service worker is waiting");
        } else if (registration.active) {
          console.log("Service worker is active");
          
          // Pedir diagnóstico adicional do service worker
          registration.active.postMessage({
            type: 'DIAGNOSTICS'
          });
        }
        
        return registration;
      } else {
        console.log("No service worker registration found");
      }
    } catch (err) {
      console.error("Error checking service worker registration:", err);
    }
  }
  return undefined;
};

/**
 * Check if browser supports PWA installation
 */
export const checkPwaSupport = (): { supported: boolean; reason?: string } => {
  // Verifica HTTPS
  if (window.location.protocol !== 'https:' && 
      window.location.hostname !== 'localhost' && 
      !window.location.hostname.includes('127.0.0.1')) {
    return { supported: false, reason: 'PWA requires HTTPS' };
  }
  
  // Verifica suporte a service worker
  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: 'Service Worker not supported' };
  }
  
  // Verifica se o navegador suporta instalação de PWA
  if (!('BeforeInstallPromptEvent' in window)) {
    return { supported: false, reason: 'PWA installation not supported in this browser' };
  }
  
  return { supported: true };
};
