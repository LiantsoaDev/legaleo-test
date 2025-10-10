# Générateur de contrat de franchise

Application Next.js 14 minimaliste permettant de saisir un questionnaire et de générer un contrat de franchise via l'API Claude d'Anthropic.

## Prérequis
- Node.js 18.18 ou version ultérieure
- npm 9+ ou équivalent (pnpm, yarn)
- Une clé API Anthropics valide disponible dans la variable d'environnement `ANTHROPIC_API_KEY`

## Installation
```bash
npm install
```

## Variables d'environnement
Créer un fichier `.env.local` (ou exporter la variable dans votre shell) avec :
```bash
ANTHROPIC_API_KEY=sk-...
```

## Lancement
- Développement :
  ```bash
  npm run dev
  ```
  L'application sera disponible sur http://localhost:3000.

- Production :
  ```bash
  npm run build
  npm start
  ```

## Notes
- Le formulaire est prérempli avec les informations fournies, mais vous pouvez ajuster librement chaque réponse avant l'envoi.
- Le bouton « Copier le texte » devient actif après une génération réussie pour faciliter le partage du contrat.
