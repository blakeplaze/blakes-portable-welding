import { NextResponse } from "next/server";
import { clientIp, tooManyRequests } from "@/lib/rate-limit";

const TO = "blakesportablewelding@gmail.com";
const MAX_FILES = 4;
const MAX_BYTES = 5 * 1024 * 1024;

function linkCount(text: string) {
  return (text.match(/https?:\/\/|www\./gi) || []).length;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: ip,
    }),
  });
  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (tooManyRequests(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const data = await request.formData();
  if (String(data.get("company_website") || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const startedAt = Number(data.get("startedAt") || 0);
  if (!startedAt || Date.now() - startedAt < 4000) {
    return NextResponse.json({ error: "Please wait a moment and try again." }, { status: 400 });
  }

  const name = String(data.get("name") || "").trim();
  const address = String(data.get("address") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const services = String(data.get("services") || "").trim();
  const details = String(data.get("details") || "").trim();
  const token = String(data.get("turnstile") || "").trim();
  const photos = data
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (!name || !address || !email || !phone) {
    return NextResponse.json(
      { error: "Please fill in name, address, email, and phone." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if ((phone.match(/\d/g) || []).length < 7) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  if (linkCount(`${name} ${address} ${details}`) >= 2) {
    return NextResponse.json(
      { error: "Please remove website links from the request." },
      { status: 400 },
    );
  }

  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json(
      { error: "Please complete the spam check and try again." },
      { status: 400 },
    );
  }

  if (photos.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Please attach up to ${MAX_FILES} photos.` },
      { status: 400 },
    );
  }

  for (const photo of photos) {
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "Attachments must be photos." }, { status: 400 });
    }
    if (photo.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Each photo needs to be under 5MB." },
        { status: 400 },
      );
    }
  }

  const outbound = new FormData();
  outbound.set("name", name);
  outbound.set("email", email);
  outbound.set("phone", phone);
  outbound.set("address", address);
  outbound.set("services", services || "None selected");
  outbound.set("details", details);
  outbound.set("_replyto", email);
  outbound.set("_subject", `Estimate request from ${name}`);
  outbound.set("_template", "table");
  outbound.set("_captcha", "false");
  photos.forEach((photo, index) => {
    outbound.set(`photo_${index + 1}`, photo, photo.name || `photo-${index + 1}.jpg`);
  });

  const response = await fetch(`https://formsubmit.co/ajax/${TO}`, {
    method: "POST",
    body: outbound,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const message = await response.text();
    return NextResponse.json(
      { error: message || "Could not send the estimate request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
