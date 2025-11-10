import fs from 'fs';
import path from 'path';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

function buildPrompt(qaPairs) {
  const header = `Tu es un assistant juridique francophone spécialisé dans la rédaction de contrats.
Ton objectif est de produire un contrat complet et cohérent en t'appuyant sur les informations fournies et sur le modèle joint.

Consignes à respecter :
1. Utilise le fichier \"modele_de_contrat.pdf\" fourni en pièce jointe comme squelette formel du document sans le retranscrire intégralement.
2. Adapte chaque section du contrat en fonction des réponses aux questions ci-dessous, en respectant l'ordre et la structure du modèle.
3. Ne renvoie que le texte final du contrat, sans instructions supplémentaires.
4. Rédige l'intégralité du contrat en français juridique clair.
5. Vérifie la cohérence de l'ensemble et signale les informations manquantes par des espaces réservés clairement identifiés (ex. \"[Information manquante]\").`;

  const formattedPairs = qaPairs
    .map((pair, index) => {
      return `### Question ${index + 1}
Question : ${pair.question.trim()}
Réponse : ${pair.answer.trim()}`;
    })
    .join('\n\n');

  return `${header}\n\nInformations recueillies :\n${formattedPairs}`;
}

async function sendToClaude({ prompt, encodedTemplate, model }) {
  const body = {
    model: model || process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620',
    max_tokens: 4096,
    temperature: 0.2,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'document',
            title: 'modele_de_contrat.pdf',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: encodedTemplate,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur Claude API (${response.status}): ${errorText}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { qaPairs, model } = req.body ?? {};

  if (!Array.isArray(qaPairs) || qaPairs.length === 0) {
    return res.status(400).json({ error: 'Veuillez fournir au moins une question et réponse.' });
  }

  const sanitizedPairs = [];
  for (const pair of qaPairs) {
    if (!pair || typeof pair.question !== 'string' || typeof pair.answer !== 'string') {
      return res.status(400).json({ error: 'Format des questions/réponses invalide.' });
    }

    const question = pair.question.trim();
    const answer = pair.answer.trim();

    if (!question || !answer) {
      return res.status(400).json({ error: 'Chaque question et réponse doit être renseignée.' });
    }

    sanitizedPairs.push({ question, answer });
  }

  const templatePath = path.join(process.cwd(), 'app', 'contract', 'modele_de_contrat.pdf');

  let templateBuffer;
  try {
    templateBuffer = await fs.promises.readFile(templatePath);
  } catch (error) {
    return res.status(500).json({
      error: "Impossible de lire le modèle de contrat. Assurez-vous que 'modele_de_contrat.pdf' est présent dans /app/contract.",
      details: error.message,
    });
  }

  const encodedTemplate = templateBuffer.toString('base64');
  const prompt = buildPrompt(sanitizedPairs);

  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'La clé API Claude est manquante (variable CLAUDE_API_KEY).' });
  }

  try {
    const claudeResponse = await sendToClaude({ prompt, encodedTemplate, model });
    return res.status(200).json({ success: true, claudeResponse });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
