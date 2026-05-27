"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

export function TurnstileWidget({
  onTokenChange,
  theme = "auto",
}: {
  onTokenChange: (token: string | null) => void;
  theme?: "light" | "dark" | "auto";
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const instanceId = useId();

  useEffect(() => {
    if (!siteKey || !loaded || !window.turnstile || !containerRef.current || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme,
      callback: (token) => onTokenChange(token),
      "expired-callback": () => onTokenChange(null),
      "error-callback": () => onTokenChange(null),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [loaded, onTokenChange, siteKey, theme]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        id={`cf-turnstile-${instanceId}`}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
      <div className="space-y-2">
        <div ref={containerRef} />
        <p className="text-xs text-[var(--color-muted)]">
          Quick security check to keep bots out.
        </p>
      </div>
    </>
  );
}
