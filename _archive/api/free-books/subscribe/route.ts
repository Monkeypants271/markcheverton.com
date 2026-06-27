import { NextResponse } from "next/server";
import {
  consumeRateLimit,
  getClientIp,
  isValidEmail,
  parseStartedAt,
  submittedTooFast,
  verifyTurnstileToken,
} from "@/lib/anti-spam";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/contacts";

export async function POST(req: Request) {
  let body: {
    email?: string;
    firstName?: string;
    website?: string;
    startedAt?: number | string;
    turnstileToken?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const firstName = (body.firstName || "").trim();
  const website = (body.website || "").trim();
  const startedAt = parseStartedAt(body.startedAt);
  const turnstileToken = (body.turnstileToken || "").trim() || null;
  const ip = getClientIp(req);

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (submittedTooFast(startedAt, 2500)) {
    return NextResponse.json(
      { error: "Please take a moment and try again." },
      { status: 400 }
    );
  }

  const rateLimit = consumeRateLimit("free-books-subscribe", ip, 6, 60 * 60 * 1000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "You've tried a few times already. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) } }
    );
  }

  const turnstile = await verifyTurnstileToken(turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json({ error: turnstile.error }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isInteger(listId)) {
    console.error(
      "Brevo not configured. Set BREVO_API_KEY and BREVO_LIST_ID in .env.local"
    );
    return NextResponse.json(
      {
        error:
          "Signup isn't configured yet on the server. Please email Mark directly.",
      },
      { status: 503 }
    );
  }

  const brevoRes = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email,
      attributes: firstName ? { FIRSTNAME: firstName } : undefined,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  if (!brevoRes.ok) {
    const text = await brevoRes.text().catch(() => "");
    console.error("Brevo error", brevoRes.status, text);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
