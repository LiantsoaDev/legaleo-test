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

  return `Tu es un·e avocat·e-rédacteur·rice spécialisé·e en franchise. À partir du modèle PDF joint « modele_de_contrat.pdf », rédige un contrat de franchise complet en français contemporain en personnalisant chaque section du modèle avec les informations utiles du contexte.

Instructions générales :
- Utilise la structure, l'ordre des clauses et les intitulés proposés dans le modèle PDF joint sans le retranscrire mot pour mot.
- Complète chaque clause avec les données contextuelles pertinentes. Si une information manque, insère clairement la mention "[à compléter]" et ne crée aucune donnée fictive.
- Adopte un ton strictement professionnel et conforme au droit français applicable aux contrats de franchise (obligations précontractuelles, conformité INPI, RGPD, etc.).
- Ajoute, si nécessaire, des clauses usuelles complémentaires lorsqu'elles s'intègrent naturellement dans la structure du modèle.
- Ne retranscris pas intégralement le contenu du modèle PDF : contente-toi de le suivre comme guide de mise en forme et d'organisation.

Contexte fourni :
${formattedContext}

Résultat attendu :
- Un contrat finalisé prêt à être remis à un futur franchisé, avec des titres numérotés, définitions, obligations, redevances, exclusivité territoriale, propriété intellectuelle, formation, accompagnement, conformité réglementaire, modalités de résiliation, pénalités, clauses de confidentialité et RGPD, non-concurrence, règlement des litiges et annexes.
- Le texte du contrat uniquement, sans instructions supplémentaires ni explications hors contrat.`;
}
