"use client";

import { useCallback, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { QA } from "@/lib/types";

const defaultItems: QA[] = [
  // --- Identité & statut réseau ---
  { question: "Prénom/Nom", answer: "Jean DURAND" },
  { question: "Enseigne", answer: "Poulet Beauty" },
  { question: "Quel est votre N° de RCS ?", answer: "RCS 449 030 725" },
  { question: "Avez-vous déjà un réseau ?", answer: "Non" },
  // Renvoi sur Onboarding flow 4 (jeunes réseaux)

  // --- Onboarding Jeune réseau 1.0 ---
  // Genèse du concept
  { question: "Quel est votre secteur d'activité ?", answer: "Salon de beauté, bien être" },
  { question: "Nombre de points de vente ?", answer: "J’ai actuellement 3 salons de beauté." },
  {
    question: "Quel type de prestations venez-vous chercher sur cette plateforme ?",
    answer:
      "Je voudrais développer un réseau de franchise de salons de beauté et avoir la possibilité de créer mes contrats directement sur la plateforme avec, si possible, la possibilité d’avoir les conseils d’un avocat. Je cherche à payer les contrats beaucoup moins cher que si j’allais voir un avocat.",
  },
  {
    question:
      "Quelle est la formation du ou des fondateurs ? Diplômes, expériences professionnelles, titres professionnels.",
    answer:
      "Le fondateur Jean Durand est diplômé d’un CAP Esthétisme obtenu en 2018. Il a complété sa formation par une école de commerce à l’IAE de Lille. Il a ensuite travaillé pour un réseau de franchise de salons de beauté, où il était directeur de réseau.",
  },
  {
    question:
      "Historique du concept — comment l’idée est-elle venue ? Comment a-t-elle été mise en action ?",
    answer:
      "En travaillant au sein d’un réseau de salons de beauté, Jean Durand a constaté le besoin de prestations distinctes au cours d’une même séance (massage, gommage, maquillage, etc.). Il a concrétisé ce concept en créant son premier salon à l’enseigne Poulet Beauty.",
  },
  {
    question:
      "Quel est l’historique de création du premier point de vente, sa date de création et le lieu de sa création ?",
    answer:
      "Premier point de vente créé le 15 juin 2022 à Paris (17ᵉ), dans une ancienne laverie permettant un découpage en plusieurs univers (accueil, salles dédiées), idéal pour le concept.",
  },
  {
    question: "Quel est l’historique du développement des points de vente suivants ?",
    answer:
      "Après Paris (15/06/2022), un second salon a été ouvert à Lille (centre-ville, proche Grand-Place) pour capter une clientèle urbaine aisée et tester une grande ville de province.",
  },
  {
    question: "Tu nous as parlé d’un troisième salon de beauté, où se trouve-t-il ?",
    answer:
      "À Lyon (secteur La Part-Dieu). Le succès identique a confirmé l’adéquation des prestations avec une clientèle de centre-ville.",
  },

  // Concept
  {
    question: "Quel est votre savoir-faire ?",
    answer:
      "Organisation des rendez-vous permettant de s’occuper de plusieurs clients en parallèle (massage, gommage, essais de produits, maquillage…). Concept inédit sur le marché.",
  },
  {
    question: "Vendez-nous votre concept.",
    answer:
      "Salons originaux par l’enseigne, l’accueil cosy et le parcours client : différentes salles, prestations complètes des pieds à la tête (gommage, massage, maquillage…) sur ~2 heures.",
  },
  {
    question: "Décrivez-nous votre projet. Soyez le plus précis possible.",
    answer:
      "Développement d’un réseau national (villes > 10 000 habitants), démarrage dans les Hauts-de-France. Uniformisation de l’aménagement, formation au concept dans un centre dédié, approvisionnement via fournisseurs référencés.",
  },
  {
    question:
      "Avez-vous mis au point un processus réitérable à l’affilié et est-il écrit dans un manuel quelconque ?",
    answer:
      "Oui, processus constitué (accueil, délivrance des prestations, usage produits, aménagement). Pas encore de manuel unique, mais des fiches par phase pouvant être unifiées.",
  },
  {
    question:
      "Sur quels documents le concept et les process ont-ils été retranscrits ? Sur un manuel opératoire ou sur un ou plusieurs autres documents ?",
    answer:
      "Sur des fiches diverses, dispersées, faciles à réunir en un document unique.",
  },
  { question: "Souhaitez-vous de l’aide pour rédiger ce manuel ?", answer: "Oui, pour retranscrire et définir le savoir-faire selon les critères légaux." },

  // Marque
  {
    question:
      "Une marque a-t-elle été enregistrée à l’INPI ou bien à l’EUIPO (Office Européen) ? Si oui, quelle marque a été enregistrée ? Sinon, quelle marque souhaitez-vous utiliser pour le réseau ?",
    answer: "R1 : Oui, j’ai enregistré la marque Poulet Beauty à l’INPI.",
  },
  {
    question:
      "Un logo est-il associé à la marque ? A-t-il été enregistré avec la marque si vous en avez déposé une, ou bien souhaitez-vous déposer le logo avec la marque à titre d’enseigne ? Si oui, pouvez-vous uploader le logo avec la marque tel que vous souhaitez avoir votre enseigne ?",
    answer:
      "Oui, j’ai un logo que je souhaite utiliser mais non enregistré avec la marque ; je le transmets avec la marque.",
  },

  // Nom de domaine
  {
    question: "Un nom de domaine a-t-il été déposé ? Si oui, auprès de quel registrar ?",
    answer:
      "Oui : pouletbeauty.com et pouletbeauty.fr, déposés chez Gandi le 17 août 2022 par Jean Durand.",
  },
  {
    question:
      "Avez-vous un extrait de l’enregistrement du nom de domaine, ou une facture de Gandi, ou un extrait “who is” ?",
    answer: "Oui, un extrait “who is” est transmis.",
  },

  // Points de vente
  {
    question: "Quels sont vos objectifs d’ouverture annuelle que vous visez ?",
    answer: "2 à 3 salons/an les 2–3 premières années, puis ~10 ouvertures/an.",
  },
  {
    question: "Avez-vous un point de vente pilote dans lequel vous expérimentez votre concept ?",
    answer:
      "Oui. Expérimentation dans les 3 salons, avec priorité au premier (centre pilote).",
  },
  {
    question:
      "Y a-t-il un agencement spécifique qui doit être reproduit dans le réseau (plan type, cahier des charges) ?",
    answer: "Oui, cahier des charges précis pour l’aménagement des salons.",
  },
  {
    question: "Avez-vous un architecte qui pourrait être repris par les affiliés ?",
    answer: "Oui, l’architecte ayant fait les plans peut travailler pour les franchisés.",
  },

  // Matériel publicitaire
  {
    question:
      "En ce qui concerne le matériel publicitaire de lancement, existe-t-il un kit de départ ? Si oui, quel contenu ? Et à la charge de quelle partie ?",
    answer:
      "Oui, kit de départ à la charge de l’affilié (produits nécessaires aux prestations + produits de revente).",
  },

  // Territoire
  {
    question: "Souhaitez-vous réserver à votre affilié un territoire exclusif ?",
    answer: "Oui, territoire affecté selon le potentiel de clientèle.",
  },

  // Informations financières
  { question: "Quelle est la durée souhaitée de votre contrat ? (Inférieure à 10 ans)", answer: "7 ans." },
  { question: "Quel sera le montant du droit d’entrée ?", answer: "25 000 €." },
  {
    question:
      "Les royalties mensuelles (redevance de marque + savoir-faire) : comment sont-elles calculées ?",
    answer: "R1 : Montant fixe de 300 € HT/mois.",
  },
  { question: "Montant de la redevance publicitaire nationale ?", answer: "2 % du chiffre d’affaires mensuel." },

  // Fixation des prix de vente
  {
    question:
      "En ce qui concerne les prix pratiqués par l’affilié, sont-ils fixés librement par l’affilié ? Et sinon, comment cela se passe-t-il ?",
    answer:
      "Liberté de fixation, sous réserve de ne pas dépasser un prix maximum. Une grille de prix (services/produits) avec prix maximum autorisé est fournie.",
  },

  // Site internet et réseaux sociaux
  {
    question:
      "L’affilié peut-il avoir un site indépendant ou doit-il avoir une page dédiée sur le site du franchiseur ?",
    answer:
      "Pages dédiées centralisées sur le site franchiseur pour uniformiser la communication.",
  },
  {
    question:
      "L’affilié peut-il avoir une page indépendante sur les réseaux sociaux ou doit-il passer par le réseau social du franchiseur ?",
    answer:
      "Passage par le réseau social du franchiseur ; un espace dédié permet de communiquer pour le compte de sa franchise.",
  },

  // Approvisionnement
  { question: "Disposez-vous d’un site marchand ?", answer: "Oui." },
  {
    question:
      "À partir de votre site, pouvez-vous vendre directement à des clients situés sur le territoire des affiliés ?",
    answer: "Oui, ventes possibles quel que soit le lieu.",
  },
  {
    question:
      "Si oui, existe-t-il des règles de compensation de l’affilié (commission ou réaffectation) ?",
    answer:
      "Oui, réaffectation du client à l’affilié ; 5 % TTC de commission sur chaque produit vendu.",
  },
  {
    question:
      "L’affilié est-il tenu de s’approvisionner auprès de la tête du réseau ?",
    answer: "Oui, pour certains produits.",
  },
  {
    question: "Pour quels produits ?",
    answer:
      "Produits essentiels (beauté, massage, gommage) négociés par la tête de réseau.",
  },
  {
    question: "Pour quel pourcentage ?",
    answer:
      "Environ 75 % des produits auprès de la tête de réseau ; le reste peut venir d’autres fournisseurs.",
  },
  {
    question:
      "Les produits sont-ils vendus par la tête de réseau ou par des fournisseurs référencés ?",
    answer: "Par des fournisseurs référencés.",
  },
  { question: "Un stock de départ doit-il être constitué par l’affilié ?", answer: "Oui." },
  {
    question:
      "Quelle quantité ? Pour quels produits le stock doit-il contenir ? Et pour chaque produit, quelle quantité ?",
    answer: "Liste et quantités uploadées sur la plateforme.",
  },
  {
    question:
      "L’affilié doit-il maintenir un minimum de stock tout au long du contrat ?",
    answer: "Oui, liste et quantités minimales uploadées sur la plateforme.",
  },
  {
    question:
      "À la fin du contrat, le stock peut-il être repris par le franchiseur ?",
    answer: "Oui, éventuellement.",
  },
  {
    question: "Si oui, à quelles conditions ?",
    answer:
      "Reprise à 50 % de la valeur d’achat si la date de péremption est > 6 mois.",
  },

  // Formation
  // Avant l’ouverture
  {
    question: "Où a lieu la formation ? Magasin pilote ou chez l’affilié ?",
    answer:
      "Dans le premier salon de beauté (magasin pilote le mieux équipé).",
  },
  {
    question: "Quelle est la durée de la formation, en heures et/ou en jours ?",
    answer: "3 semaines (15 jours pleins).",
  },
  { question: "Qui dispense la formation ?", answer: "La tête de réseau." },
  {
    question: "Qui prend en charge les frais de déplacement de l’affilié ?",
    answer: "Le candidat.",
  },
  // À l’ouverture
  {
    question:
      "Est-ce que la tête de réseau est présente à l’ouverture (assistance à l’ouverture) ?",
    answer: "Oui.",
  },
  {
    question:
      "Combien de temps (heures / jours) de présence auprès de l’affilié ?",
    answer: "3 jours pleins avant et au moment de l’ouverture.",
  },
  // Après l’ouverture
  {
    question: "Une formation continue est-elle dispensée dans le réseau ?",
    answer: "Oui.",
  },
  {
    question: "Sur quelle durée par an (heures/jours) ?",
    answer: "1 semaine.",
  },
  {
    question: "Si oui, à quelle fréquence ?",
    answer: "Trois sessions de deux jours réparties sur l’année.",
  },
  {
    question:
      "Par qui est supporté le coût de la formation continue ? Affilié ou tête de réseau ?",
    answer: "Tête de réseau.",
  },
  { question: "Qui supporte les frais de déplacement ?", answer: "L’affilié." },

  // Convention annuelle
  { question: "Organisez-vous une convention annuelle ?", answer: "Oui." },
  {
    question:
      "Les frais de déplacement sont-ils à la charge de l’affilié ou de la tête de réseau ?",
    answer: "À la charge des affiliés.",
  },

  // Outils de gestion
  {
    question:
      "Utilisez-vous un logiciel de pilotage et de gestion (caisse, stock, comptabilité, réassort, etc.) ?",
    answer: "Oui, un logiciel réseau.",
  },
  {
    question:
      "Si oui, les licences affiliées sont-elles conclues directement avec la tête de réseau ou avec un prestataire tiers ?",
    answer:
      "Avec les prestataires (le logiciel n’a pas été développé en interne).",
  },
  { question: "Quel est le nom de votre logiciel ?", answer: "Superlicence." },
  {
    question:
      "Quel est le périmètre de votre logiciel (caisse, stock, données comptables, réassort, etc.) ?",
    answer:
      "Caisse et prises de rendez-vous. Pas de stock, données comptables ou réassort.",
  },

  // Local de l’affilié
  {
    question:
      "En ce qui concerne le choix du local de l’affilié, existe-t-il des critères de sélection ? La tête de réseau doit-elle agréer le choix du local ?",
    answer:
      "Pas d’agrément obligatoire, mais information transmise à la tête de réseau qui conseille. Des critères écrits (surface, situation, aménagement) doivent être respectés.",
  },
  {
    question:
      "Existe-t-il un délai entre la signature du contrat et les travaux d’aménagement que doit effectuer l’affilié dans son local ? (Q61)",
    answer: "Oui, 6 mois à compter de la signature.",
  },
  {
    question:
      "Existe-t-il un délai entre la signature du contrat et les travaux d’aménagement que doit effectuer l’affilié dans son local ? (Q62)",
    answer: "Oui, 6 mois à compter de la signature.",
  },
  {
    question:
      "Les heures et jours d’ouverture du point de vente de l’affilié lui sont-ils imposés ou reste-t-il libre de les fixer ?",
    answer:
      "Obligation de respecter les horaires/jours des points pilotes (issus de l’expérience).",
  },

  // Système de paiement
  {
    question: "Quel est le système de paiement proposé aux clients ?",
    answer:
      "Paiement par carte bleue pour les clients. Entre affiliés et tête de réseau : application GoCardless.",
  },

  // Commission de présentation
  {
    question:
      "Les affiliés qui aident à recruter d’autres affiliés ont-ils droit à une rémunération ?",
    answer: "Oui, 10 % du droit d’entrée.",
  },
];

const MIN_ANSWER_LENGTH = 2;

type FetchState = "idle" | "loading" | "success" | "error";

type ApiResponse =
  | { ok: true; text: string }
  | { ok: false; error: string };

export default function HomePage() {
  const [items, setItems] = useState<QA[]>(defaultItems);
  const [status, setStatus] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [contract, setContract] = useState<string>("");

  const outputRows = useMemo(() => {
    if (!contract) {
      return 12;
    }

    const lineCount = contract.split(/\r?\n/).length + 2;
    return Math.max(12, Math.min(40, lineCount));
  }, [contract]);

  const allValid = useMemo(
    () =>
      items.every((item) => item.answer.trim().length >= MIN_ANSWER_LENGTH),
    [items]
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      setItems((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], answer: value };
        return next;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!allValid) {
        setStatus("error");
        setErrorMessage(
          "Merci de compléter chaque réponse (au moins quelques mots) avant de générer le contrat."
        );
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });

        const payload = (await response.json()) as ApiResponse;

        if (!response.ok || !payload.ok) {
          const message = !payload.ok ? payload.error : "Erreur réseau inattendue.";
          setStatus("error");
          setErrorMessage(message);
          return;
        }

        setContract(payload.text);
        setStatus("success");
      } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire", error);
        setStatus("error");
        setErrorMessage(
          "Une erreur imprévue est survenue pendant la génération. Merci de réessayer."
        );
      }
    },
    [allValid, items]
  );

  const handleCopy = useCallback(async () => {
    if (!contract) {
      return;
    }

    try {
      await navigator.clipboard.writeText(contract);
      setStatus("success");
      setErrorMessage("");
    } catch (error) {
      console.error("Impossible de copier le texte", error);
      setStatus("error");
      setErrorMessage("La copie dans le presse-papiers a échoué. Copiez manuellement le contrat.");
    }
  }, [contract]);

  return (
    <>
      <header>
        <h1>Assistant de génération de contrat de franchise</h1>
        <p>
          Ajustez les réponses ci-dessous puis demandez à Claude de rédiger un contrat détaillé et conforme
          au droit français de la franchise.
        </p>
      </header>
      <form onSubmit={handleSubmit} aria-describedby="form-feedback">
        <fieldset>
          {items.map((item, index) => (
            <div key={item.question}>
              <label htmlFor={`question-${index}`}>{item.question}</label>
              <textarea
                id={`question-${index}`}
                value={item.answer}
                onChange={(event) => handleChange(index, event.target.value)}
                minLength={MIN_ANSWER_LENGTH}
                required
                aria-required={true}
              />
            </div>
          ))}
        </fieldset>
        <div className="button-row">
          <button className="primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Génération en cours…" : "Générer le contrat"}
          </button>
          <button
            className="secondary"
            type="button"
            onClick={handleCopy}
            disabled={!contract}
          >
            Copier le texte
          </button>
        </div>
        <div id="form-feedback" role="status" aria-live="polite">
          {status === "error" && errorMessage && <p className="error">{errorMessage}</p>}
          {status === "success" && contract && <p className="success">Contrat généré.</p>}
        </div>
      </form>

      {contract && (
        <section className="output-panel" aria-label="Contrat généré">
          <textarea
            className="contract-output"
            value={contract}
            readOnly
            rows={outputRows}
            aria-label="Contrat généré"
          />
        </section>
      )}
    </>
  );
}
