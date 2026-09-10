import { NextResponse } from "next/server";
import { clientIp, tooManyRequests } from "@/lib/rate-limit";

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
    return NextResponse.json({ ok: true, skip: true });
  }

  const startedAt = Number(data.get("startedAt") || 0);
  if (!startedAt || Date.now() - startedAt < 4000) {
    return NextResponse.json({ error: "Please wait a moment and try again." }, { status: 400 });
  }

  const name = String(data.get("name") || "").trim();
  const address = String(data.get("address") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const details = String(data.get("details") || "").trim();
  const token = String(data.get("turnstile") || "").trim();

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

  return NextResponse.json({ ok: true });
}
