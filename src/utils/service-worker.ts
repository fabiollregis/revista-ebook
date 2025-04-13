
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
