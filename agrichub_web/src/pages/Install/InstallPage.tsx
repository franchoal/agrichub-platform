
import { useEffect, useState } from "react";
import {
  Download,
  Smartphone,
  Share2,
  CheckCircle2,
  ExternalLink,
  Copy,
} from "lucide-react";

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

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

// Always use the official AgricWise Africa custom domain.
const APP_URL = "https://myagricwyse.online/";
const INSTALL_URL = "https://myagricwyse.online/install";

// Capture the browser's native PWA installation prompt.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event: Event) => {
    event.preventDefault();

    deferredInstallPrompt = event as BeforeInstallPromptEvent;

    window.dispatchEvent(
      new Event("agricwise-install-available")
    );
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
  });
}

function isRunningAsInstalledApp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent;

  const isAppleMobileDevice =
    /iPhone|iPad|iPod/i.test(userAgent);

  // iPadOS can identify itself as a Mac when requesting desktop sites.
  const isIPadOS =
    /Macintosh/i.test(userAgent) &&
    navigator.maxTouchPoints > 1;

  return isAppleMobileDevice || isIPadOS;
}

function canUseNativeShare(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  );
}

function InstallPage() {
  const [canInstall, setCanInstall] = useState(
    () => Boolean(deferredInstallPrompt)
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [message, setMessage] = useState("");

  const isIOS = isIOSDevice();

  useEffect(() => {
    const syncInstallState = () => {
      setCanInstall(Boolean(deferredInstallPrompt));
    };

    const handleInstalled = () => {
      deferredInstallPrompt = null;
      setCanInstall(false);
      setIsInstalled(true);
      setMessage(
        "AgricWise Africa has been installed successfully."
      );
    };

    setIsInstalled(isRunningAsInstalledApp());
    syncInstallState();

    window.addEventListener(
      "agricwise-install-available",
      syncInstallState
    );
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "agricwise-install-available",
        syncInstallState
      );
      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  const handleInstall = async () => {
    if (isInstalled) {
      window.location.href = APP_URL;
      return;
    }

    const installEvent = deferredInstallPrompt;

    if (!installEvent) {
      if (isIOS) {
        setMessage(
          "On your iPhone or iPad, open this page in Safari, tap Share, choose Add to Home Screen, then tap Add."
        );
      } else {
        setMessage(
          "If your browser supports installation, open its menu and look for Install app or Add to Home screen. Chrome on Android is recommended."
        );
      }

      return;
    }

    try {
      await installEvent.prompt();

      const choice = await installEvent.userChoice;

      // Clear only the prompt that was just used.
      if (deferredInstallPrompt === installEvent) {
        deferredInstallPrompt = null;
      }

      setCanInstall(false);

      if (choice.outcome === "accepted") {
        setMessage(
          "You accepted the installation request. Follow any remaining browser instructions."
        );
      } else {
        setMessage(
          "Installation was cancelled. You can try again using your browser menu if installation is available."
        );
      }
    } catch {
      setMessage(
        "Your browser could not start installation. Please follow the installation instructions below."
      );
    }
  };

  const handleShare = async () => {
    if (canUseNativeShare()) {
      try {
        await navigator.share({
          title: "AgricWise Africa",
          text: "Connect. Trade. Grow. Install AgricWise Africa on your phone.",
          url: INSTALL_URL,
        });

        return;
      } catch (error) {
        // Closing the native share sheet is not an error.
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        // Continue to the copy-link fallback if sharing fails.
      }
    }

    try {
      if (
        typeof navigator.clipboard?.writeText === "function" &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(INSTALL_URL);

        setMessage(
          "Installation link copied. You can now share it with others."
        );

        return;
      }
    } catch {
      // Fall through to the manual-copy option.
    }

    window.prompt(
      "Copy the AgricWise Africa installation link:",
      INSTALL_URL
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg">
        <header className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-700 text-white shadow-lg shadow-green-900/20">
            <Smartphone size={40} strokeWidth={1.8} />
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            AgricWise Africa
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Agriculture, closer to you.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-gray-600">
            Install AgricWise Africa on your phone for convenient
            access to agricultural businesses, products, and
            communities.
          </p>
        </header>

        <section className="mt-8 rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          {isInstalled ? (
            <div className="text-center">
              <CheckCircle2
                className="mx-auto text-green-600"
                size={38}
              />

              <h2 className="mt-3 text-xl font-bold text-gray-900">
                Ready to grow?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                AgricWise Africa is running as an installed app.
              </p>

              <a
                href={APP_URL}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                Open AgricWise Africa
                <ExternalLink size={17} />
              </a>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleInstall}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-700 px-5 py-4 font-bold text-white shadow-md transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                <Download size={21} />

                {canInstall
                  ? "Install AgricWise Africa"
                  : "How to install the app"}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                Free to install. No Play Store download is required.
              </p>

              <a
                href={APP_URL}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Open AgricWise Africa
                <ExternalLink size={17} />
              </a>
            </>
          )}

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 rounded-xl bg-green-50 p-3 text-sm leading-6 text-green-900"
            >
              {message}
            </p>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Install in a few steps
          </h2>

          {isIOS ? (
            <ol className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                  1
                </span>
                <span>Open this page in Safari.</span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                  2
                </span>
                <span>Tap the Share icon in Safari.</span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                  3
                </span>
                <span>
                  Select Add to Home Screen, then tap Add.
                </span>
              </li>
            </ol>
          ) : (
            <ol className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                  1
                </span>
                <span>
                  Open this page in Chrome on Android, if available.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                  2
                </span>
                <span>
                  Tap Install app if offered. Otherwise, open the
                  browser menu and look for Install app or Add to
                  Home screen.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                  3
                </span>
                <span>
                  Confirm the installation and launch AgricWise Africa
                  from your home screen.
                </span>
              </li>
            </ol>
          )}
        </section>

        <button
          type="button"
          onClick={handleShare}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-green-800 transition hover:bg-green-100 focus:outline-none focus:ring-4 focus:ring-green-200"
        >
          {canUseNativeShare() ? (
            <Share2 size={19} />
          ) : (
            <Copy size={19} />
          )}

          Share installation link
        </button>

        <footer className="mt-8 text-center text-xs text-gray-500">
          AgricWise Africa
          <span className="mx-2">·</span>
          Connect. Trade. Grow.
        </footer>
      </div>
    </main>
  );
}

export default InstallPage;