
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

declare global {
  interface WindowEventMap {
    "agricwise-install-available": Event;
  }
}

const APP_URL = "https://myagricwyse.online/";

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
let listenersInitialized = false;

function initializeInstallListeners() {
  if (typeof window === "undefined" || listenersInitialized) {
    return;
  }

  listenersInitialized = true;

  window.addEventListener("beforeinstallprompt", (event: Event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;

    window.dispatchEvent(
      new Event("agricwise-install-available"),
    );
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
  });
}

initializeInstallListeners();

export function canInstallAgricWise(): boolean {
  initializeInstallListeners();
  return Boolean(deferredInstallPrompt);
}

export function isRunningAsInstalledApp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1)
  );
}

export interface AgricWiseInstallResult {
  redirected: boolean;
  message: string;
}

export async function installAgricWise(): Promise<AgricWiseInstallResult> {
  initializeInstallListeners();

  if (isRunningAsInstalledApp()) {
    window.location.href = APP_URL;

    return {
      redirected: true,
      message: "",
    };
  }

  const installEvent = deferredInstallPrompt;

  if (!installEvent) {
    return {
      redirected: false,
      message: isIOSDevice()
        ? "On your iPhone or iPad, open this page in Safari, tap Share, choose Add to Home Screen, then tap Add."
        : "If your browser supports installation, open its menu and look for Install app or Add to Home screen. Chrome on Android is recommended.",
    };
  }

  try {
    await installEvent.prompt();

    const choice = await installEvent.userChoice;

    if (deferredInstallPrompt === installEvent) {
      deferredInstallPrompt = null;
    }

    window.dispatchEvent(
      new Event("agricwise-install-available"),
    );

    return {
      redirected: false,
      message:
        choice.outcome === "accepted"
          ? "AgricWise installation has started. Follow your browser's instructions to complete it."
          : "Installation was cancelled. You can try again from your browser's install option.",
    };
  } catch {
    if (deferredInstallPrompt === installEvent) {
      deferredInstallPrompt = null;
    }

    window.dispatchEvent(
      new Event("agricwise-install-available"),
    );

    return {
      redirected: false,
      message:
        "Your browser couldn't start the installation. Open its menu and look for Install app or Add to Home screen.",
    };
  }
}
