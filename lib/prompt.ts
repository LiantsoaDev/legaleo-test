import type { QA } from "./types";

/**
 * Construit un prompt structuré pour Claude à partir des réponses au questionnaire.
 * Le format reprend les points clefs sous forme de sections compréhensibles.
 */
export function buildPrompt(items: QA[]): string {
  const formattedContext = items
    .map((item, index) => {
      const header = `Information ${index + 1}`;
      return `${header}\nQuestion : ${item.question}\nRéponse : ${item.answer || "[à compléter]"}`;
    })
    .join("\n\n");

  return `Tu es un avocat-rédacteur. Rédige un contrat de franchise complet, précis, en français contemporain, avec clauses standard et adaptées au contexte transmis.

Contexte fourni :
${formattedContext}

Contraintes d'écriture :
- Ton strictement professionnel.
- Ne pas inventer de données manquantes : indiquer explicitement "[à compléter]".
- Adapter le contrat au cadre juridique français des réseaux de franchise.

Structure attendue :
- Un contrat avec titres numérotés, définitions, obligations, redevances, exclusivité territoriale, propriété intellectuelle, formation, manuel opératoire, conformité INPI, durée, résiliation, pénalités, confidentialité, RGPD, non-concurrence, médiation/tribunal compétent, annexes.
- Ajouter toute clause usuelle pertinente pour un contrat de franchise complet en France.

Génère uniquement le texte du contrat.`;
}
