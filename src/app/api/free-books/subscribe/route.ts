import { NextResponse } from "next/server";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/contacts";

export async function POST(req: Request) {
  let body: { email?: string; firstName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const firstName = (body.firstName || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
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
