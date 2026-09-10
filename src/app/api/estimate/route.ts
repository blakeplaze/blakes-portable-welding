import { NextResponse } from "next/server";

const TO = "Estimates@Bpweld.com";
const MAX_FILES = 4;
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const data = await request.formData();
  const name = String(data.get("name") || "").trim();
  const address = String(data.get("address") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const services = String(data.get("services") || "").trim();
  const details = String(data.get("details") || "").trim();
  const photos = data
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (!name || !address || !email || !phone) {
    return NextResponse.json(
      { error: "Please fill in name, address, email, and phone." },
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
