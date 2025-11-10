import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import type { QA } from "@/lib/types";

type GenerateBody = {
  items: QA[];
};

/**
 * Vérifie que la charge utile reçue correspond au format attendu.
 */
function isValidPayload(body: unknown): body is GenerateBody {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  if (!Array.isArray((body as GenerateBody).items)) {
    return false;
  }

  return (body as GenerateBody).items.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      typeof entry.question === "string" &&
      typeof entry.answer === "string"
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env["ANTHROPIC_API_KEY"];

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Clé API Anthropics manquante. Veuillez configurer ANTHROPIC_API_KEY.",
      },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as unknown;

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { ok: false, error: "Format de données invalide." },
      { status: 400 }
    );
  }

  const missingAnswer = body.items.find((item) => item.answer.trim().length === 0);
  if (missingAnswer) {
    return NextResponse.json(
      {
        ok: false,
        error: "Toutes les réponses doivent être renseignées avant la génération du contrat.",
      },
      { status: 400 }
    );
  }

  const prompt = buildPrompt(body.items);

  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 64000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorPayload = (await anthropicResponse.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      const upstreamMessage = errorPayload?.error?.message;

      const friendlyMessage = upstreamMessage?.toLowerCase().includes("model")
        ? "Le modèle de génération demandé est indisponible. Vérifiez le nom du modèle Anthropics configuré."
        : undefined;

      return NextResponse.json(
        {
          ok: false,
          error: friendlyMessage ?? upstreamMessage ?? `Erreur Anthropics ${anthropicResponse.status}`,
        },
        { status: 502 }
      );
    }

    const parsed = (await anthropicResponse.json()) as {
      content?: Array<{ text?: string }>;
    };

    const text = parsed.content?.[0]?.text ?? "";

    return NextResponse.json({ ok: true, text });
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Anthropics", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Une erreur est survenue lors de la génération du contrat.",
      },
      { status: 500 }
    );
  }
}
