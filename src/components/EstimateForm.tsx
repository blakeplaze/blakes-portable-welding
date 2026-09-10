"use client";

import { FormEvent, useEffect, useState } from "react";
import { Turnstile, turnstileEnabled } from "@/components/Turnstile";

const services = ["Mobile Welding", "Aluminum", "Steel", "Stainless", "Other Exotic"];
const MAX_PHOTOS = 4;
const FORM_SUBMIT_AJAX = "https://formsubmit.co/ajax/blakesportablewelding@gmail.com";
const FALLBACK_ERROR = "Could not send the request. Please try again or call 313-512-9353.";
const ACTIVATION_ERROR =
  "The shop inbox still needs a one-time FormSubmit confirmation. Open the latest email from FormSubmit in blakesportablewelding@gmail.com, click Activate Form, then submit again.";

function safeError(message?: string) {
  if (!message || /<!DOCTYPE|<html|Just a moment|needs Activation|Activate Form/i.test(message)) {
    return FALLBACK_ERROR;
  }
  return message;
}

function isHtml(value: string) {
  return /<!DOCTYPE|<html|Just a moment/i.test(value);
}

function isActivationResponse(text: string, message?: string) {
  return /needs Activation|Activate Form|Check Your Email|we've sent you an email/i.test(
    `${text} ${message || ""}`,
  );
}

function formSubmitFields(payload: FormData) {
  const outbound = new FormData();
  outbound.set("name", String(payload.get("name") || ""));
  outbound.set("address", String(payload.get("address") || ""));
  outbound.set("email", String(payload.get("email") || ""));
  outbound.set("phone", String(payload.get("phone") || ""));
  outbound.set("services", String(payload.get("services") || "None selected"));
  outbound.set("details", String(payload.get("details") || ""));
  outbound.set("_replyto", String(payload.get("email") || ""));
  outbound.set("_subject", `Estimate request from ${String(payload.get("name") || "").trim()}`);
  outbound.set("_template", "table");
  outbound.set("_captcha", "false");
  payload.getAll("photos").forEach((photo, index) => {
    if (photo instanceof File && photo.size > 0) {
      outbound.set(
        index === 0 ? "attachment" : `attachment${index + 1}`,
        photo,
        photo.name || `photo-${index + 1}.jpg`,
      );
    }
  });
  return outbound;
}

async function sendToFormSubmit(payload: FormData) {
  const outbound = formSubmitFields(payload);
  let response: Response;
  let text: string;
  try {
    response = await fetch(FORM_SUBMIT_AJAX, {
      method: "POST",
      body: outbound,
      headers: { Accept: "application/json" },
    });
    text = await response.text();
  } catch {
    throw new Error(FALLBACK_ERROR);
  }
  if (isActivationResponse(text)) {
    throw new Error(ACTIVATION_ERROR);
  }
  if (isHtml(text)) {
    throw new Error(FALLBACK_ERROR);
  }
  let result: { success?: boolean | string; message?: string };
  try {
    result = JSON.parse(text) as { success?: boolean | string; message?: string };
  } catch {
    throw new Error(FALLBACK_ERROR);
  }
  if (isActivationResponse(text, result.message)) {
    throw new Error(ACTIVATION_ERROR);
  }
  if (!response.ok || result.success === false || result.success === "false") {
    throw new Error(safeError(result.message));
  }
}

async function compressPhoto(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.78),
    );
    bitmap.close();
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function EstimateForm({ id = "estimate" }: { id?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const urls = photos.map((photo) => URL.createObjectURL(photo));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  useEffect(() => {
    setReady(true);
    setStartedAt(Date.now());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("sent") !== id) return;
    setStatus("sent");
    params.delete("sent");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, [id]);

  async function onPhotos(fileList: FileList | null) {
    const next = [...photos];
    for (const file of Array.from(fileList || [])) {
      if (!file.type.startsWith("image/") || next.length >= MAX_PHOTOS) continue;
      next.push(await compressPhoto(file));
    }
    setPhotos(next.slice(0, MAX_PHOTOS));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const chosen = services.filter((service) => data.get(service) === "on");
    const payload = new FormData();
    payload.set("name", String(data.get("name") || ""));
    payload.set("address", String(data.get("address") || ""));
    payload.set("email", String(data.get("email") || ""));
    payload.set("phone", String(data.get("phone") || ""));
    payload.set("details", String(data.get("details") || ""));
    payload.set("services", chosen.join(", "));
    payload.set("company_website", String(data.get("company_website") || ""));
    payload.set("startedAt", String(startedAt ?? Date.now()));
    payload.set("turnstile", turnstileToken);
    photos.forEach((photo) => payload.append("photos", photo));

    if (String(payload.get("company_website") || "").trim()) {
      form.reset();
      setPhotos([]);
      setStatus("sent");
      return;
    }

    const check = new FormData();
    [
      "name",
      "address",
      "email",
      "phone",
      "details",
      "services",
      "company_website",
      "startedAt",
      "turnstile",
    ].forEach((key) => check.set(key, String(payload.get(key) || "")));

    try {
      const response = await fetch("/api/estimate", { method: "POST", body: check });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        skip?: boolean;
      };
      if (!response.ok) {
        throw new Error(safeError(result.error));
      }
      if (!result.skip) {
        await sendToFormSubmit(payload);
      }
      form.reset();
      setPhotos([]);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(safeError(err instanceof Error ? err.message : ""));
    }
  }

  return (
    <section id={id} className="mx-auto w-full max-w-md px-5 py-8" suppressHydrationWarning>
      <h2 className="mb-6 text-center text-2xl font-normal" suppressHydrationWarning>
        Estimate Request
      </h2>
      {!ready ? (
        <div className="space-y-3" aria-hidden="true" suppressHydrationWarning>
          <div className="field min-h-12" />
          <div className="field min-h-12" />
          <div className="field min-h-12" />
          <div className="field min-h-12" />
          <div className="field min-h-28" />
          <div className="btn mt-2 h-12 w-full" />
        </div>
      ) : (
      <form onSubmit={onSubmit} className="relative space-y-3" suppressHydrationWarning>
        <div className="hp" aria-hidden="true">
          <label>
            Company website
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              suppressHydrationWarning
            />
          </label>
        </div>
        <input
          required
          name="name"
          autoComplete="name"
          className="field"
          placeholder="Name or Company Name *"
          aria-label="Name or Company Name (required)"
          suppressHydrationWarning
        />
        <input
          required
          name="address"
          autoComplete="street-address"
          className="field"
          placeholder="Address For Service *"
          aria-label="Address For Service (required)"
          suppressHydrationWarning
        />
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="field"
          placeholder="Email *"
          aria-label="Email (required)"
          suppressHydrationWarning
        />
        <input
          required
          type="tel"
          name="phone"
          autoComplete="tel"
          className="field"
          placeholder="Phone *"
          aria-label="Phone (required)"
          suppressHydrationWarning
        />
        <textarea
          name="details"
          rows={4}
          autoComplete="off"
          className="field resize-y"
          placeholder="Provide any further details you think may be helpful to us."
          suppressHydrationWarning
        />
        <div className="text-left text-sm">
          <p>Attach a photo (optional). You can add up to 4. Tap a thumbnail to remove it.</p>
          <label className="btn-outline mt-3 w-full">
            {photos.length ? "Add more photos" : "Choose photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                void onPhotos(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {previews.map((src, index) => (
              <button
                key={src}
                type="button"
                className="relative"
                onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                aria-label="Remove photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-16 w-16 rounded object-cover" />
              </button>
            ))}
          </div>
        ) : null}
        <fieldset className="pt-3 text-left text-sm">
          <legend className="mb-2 font-medium">
            What services do you need (Check all that apply)? *
          </legend>
          {services.map((service) => (
            <label key={service} className="mb-1 flex items-center gap-2">
              <input type="checkbox" name={service} />
              {service}
              {service === "Mobile Welding" ? ":" : ""}
            </label>
          ))}
        </fieldset>
        <Turnstile onToken={setTurnstileToken} />
        <button
          type="submit"
          className={`btn mt-2 w-full gap-2 ${status === "sent" ? "btn-success" : ""}`}
          disabled={
            status === "sending" ||
            status === "sent" ||
            (turnstileEnabled && !turnstileToken)
          }
        >
          {status === "sent" ? (
            <>
              <svg className="check-pop" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M7 12.5l3.2 3.2L17 8.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sent
            </>
          ) : status === "sending" ? (
            "Sending..."
          ) : (
            "Submit"
          )}
        </button>
        {status === "sent" ? (
          <p className="text-center text-sm text-muted">
            Thanks — your estimate request was sent. We&apos;ll follow up at the
            email you entered.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-center text-sm text-red-700">{error}</p>
        ) : null}
      </form>
      )}
    </section>
  );
}
