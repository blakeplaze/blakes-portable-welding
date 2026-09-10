"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      theme?: string;
      appearance?: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<void> | null = null;

function loadScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load spam check."));
    document.head.appendChild(script);
  });
  return loading;
}

export function Turnstile({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef("");
  const tokenFn = useRef(onToken);
  tokenFn.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let active = true;
    void loadScript().then(() => {
      if (!active || !box.current || !window.turnstile) return;
      widget.current = window.turnstile.render(box.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (token) => tokenFn.current(token),
        "expired-callback": () => tokenFn.current(""),
        "error-callback": () => tokenFn.current(""),
      });
    });
    return () => {
      active = false;
      if (widget.current && window.turnstile) {
        window.turnstile.remove(widget.current);
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={box} className="flex justify-center py-2" />;
}

export const turnstileEnabled = Boolean(SITE_KEY);
