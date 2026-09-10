"use client";

import { FormEvent, useEffect, useState } from "react";

const services = ["Mobile Welding", "Aluminum", "Steel", "Stainless", "Other Exotic"];
const MAX_PHOTOS = 4;

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

  useEffect(() => {
    const urls = photos.map((photo) => URL.createObjectURL(photo));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

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
    photos.forEach((photo) => payload.append("photos", photo));

    try {
      const response = await fetch("/api/estimate", { method: "POST", body: payload });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not send the request.");
      }
      form.reset();
      setPhotos([]);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send the request.");
    }
  }

  return (
    <section id={id} className="mx-auto w-full max-w-md px-5 py-8">
      <h2 className="mb-6 text-center text-2xl font-normal">Estimate Request</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          required
          name="name"
          className="field"
          placeholder="Name or Company Name *"
          aria-label="Name or Company Name (required)"
        />
        <input
          required
          name="address"
          className="field"
          placeholder="Address For Service *"
          aria-label="Address For Service (required)"
        />
        <input
          required
          type="email"
          name="email"
          className="field"
          placeholder="Email *"
          aria-label="Email (required)"
        />
        <input
          required
          type="tel"
          name="phone"
          className="field"
          placeholder="Phone *"
          aria-label="Phone (required)"
        />
        <textarea
          name="details"
          rows={4}
          className="field resize-y"
          placeholder="Provide any further details you think may be helpful to us."
        />
        <label className="block text-left text-sm">
          Attach a photo (optional). You can add up to 4. Tap a thumbnail to remove it.
          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-2 block w-full text-sm"
            onChange={(event) => {
              void onPhotos(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
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
        <button type="submit" className="btn mt-2 w-full" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Submit"}
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
    </section>
  );
}
