import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { clientIp, tooManyRequests } from "@/lib/rate-limit";

const TO = "blakesportablewelding@gmail.com";
const MAX_FILES = 4;
const MAX_BYTES = 5 * 1024 * 1024;

function linkCount(text: string) {
  return (text.match(/https?:\/\/|www\./gi) || []).length;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

  const user = process.env.GMAIL_USER || TO;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) {
    return NextResponse.json(
      { error: "Estimate email is not set up yet. Please call 313-512-9353." },
      { status: 503 },
    );
  }

  const attachments = await Promise.all(
    photos.map(async (photo, index) => ({
      filename: photo.name || `photo-${index + 1}.jpg`,
      content: Buffer.from(await photo.arrayBuffer()),
      contentType: photo.type || "image/jpeg",
    })),
  );

  const text = [
    `Name: ${name}`,
    `Address: ${address}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Services: ${services || "None selected"}`,
    "",
    "Details:",
    details || "(none)",
  ].join("\n");

  const html = `
    <h2>Estimate request</h2>
    <table>
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Address</strong></td><td>${escapeHtml(address)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
      <tr><td><strong>Services</strong></td><td>${escapeHtml(services || "None selected")}</td></tr>
    </table>
    <p><strong>Details</strong></p>
    <p>${escapeHtml(details || "(none)").replace(/\n/g, "<br>")}</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Blake's Portable Welding" <${user}>`,
      to: TO,
      replyTo: email,
      subject: `Estimate request from ${name}`,
      text,
      html,
      attachments,
    });
  } catch (err) {
    console.error("Estimate email failed", err);
    return NextResponse.json(
      { error: "Could not send the estimate request. Please try again or call 313-512-9353." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
