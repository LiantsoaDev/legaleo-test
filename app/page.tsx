"use client";

import { useCallback, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { QA } from "@/lib/types";

const defaultItems: QA[] = [
  {
    question: "Quel est votre secteur d'activité ?",
    answer: "Salon de beauté, bien être",
  },
  {
    question: "Nombre de points de vente ?",
    answer: "J’ai actuellement 3 salons de beauté.",
  },
  {
    question: "Quel type de prestations venez-vous chercher sur cette plateforme ?",
    answer:
      "Je voudrais développer un réseau de franchise de salons de beauté et avoir la possibilité de créer mes contrats directement sur la plateforme avec, si possible, la possibilité d’avoir les conseils d’un avocat. Je cherche à payer les contrats beaucoup moins cher que si j’allais voir un avocat. Concept",
  },
  {
    question: "Quel est votre savoir-faire ?",
    answer:
      "Mon savoir-faire consiste à avoir organisé les rendez-vous avec les clients de telle sorte que je puisse m’occuper de plusieurs clients en même temps. Il y a une partie massage, une partie gommage, une partie essai de produits de beauté, un peu de maquillage, etc. Il s’agit d’un nouveau concept qui n’existe pas sur le marché.",
  },
  {
    question: "Vendez-nous votre concept.",
    answer:
      "Il s’agit de salons de beauté originaux. D’une part, par l’enseigne, d’autre part, par l’accueil des clients dans un univers très cosy et confortable. Également, par le fait que les clients passent par différentes salles et bénéficient de différentes prestations complètes. Lorsque les clients ressortent du salon de beauté, ils ont eu droit à des soins de la tête aux pieds : gommage, massage, maquillage… Le tout sur un temps d’environ deux heures, en passant d’une salle à l’autre avec des univers différents.",
  },
  {
    question: "Décrivez-nous votre projet. Soyez le plus précis possible.",
    answer:
      "Je souhaiterais développer un réseau sur la France entière. À cette fin, je souhaiterais trouver des franchisés dans chaque ville de plus de 10 000 habitants. Dans un premier temps, je souhaiterais commencer par le nord de la France, et précisément les Hauts-de-France, que je connais bien, puisque mes trois salons de beauté sont situés dans le nord. Je souhaiterais que tous les salons aient le même aménagement que celui que j’ai créé pour mes propres salons, et que les franchisés apprennent mon concept et mes méthodes dans un centre de formation que j’ai créé, et qu’ils utilisent également les produits que je commande auprès de fournisseurs que je connais.",
  },
  {
    question:
      "Avez-vous mis au point un processus réitérable à l’affilié et est-il écrit dans un manuel quelconque ?",
    answer:
      "Je pense que j’ai mis au point un processus au fur et à mesure de la création de mon enseigne : la façon de recevoir mes clients, la façon de dispenser différentes prestations de la tête aux pieds, d’utiliser des produits différents, l’aménagement de mes salons… Tout cela peut être considéré comme un processus que l’affilié pourra réitérer — et même devra reproduire — pour réussir à créer un salon Poulet Beauty. En ce qui concerne l’écrit, je n’ai pas véritablement rédigé un manuel reproduisant l’ensemble des processus, mais néanmoins, j’ai créé des fiches sur toutes les différentes phases de conception qui pourraient être synthétisées et unifiées dans un document.",
  },
  {
    question: "Une marque a-t-elle été enregistrée à l’INPI ou bien à l’EUIPO (Office Européen) ?",
    answer: "Oui, j’ai enregistré la marque Poulet Beauty à l’INPI.",
  },
  {
    question:
      "Un logo est-il associé à la marque ? A-t-il été enregistré avec la marque si vous en avez déposé une, ou bien souhaitez-vous déposer le logo avec la marque à titre d’enseigne ?",
    answer:
      "Oui, j’ai un logo que je souhaiterais utiliser, mais que je n’ai pas enregistré avec la marque. Je ne sais pas si c’est utile de le faire. Je vous le transmets avec la marque.",
  },
  {
    question: "Quels sont vos objectifs d’ouverture annuelle que vous visez ?",
    answer:
      "Je souhaiterais ouvrir, au départ, deux ou trois salons par an durant les deux ou trois premières années, puis adopter ensuite un rythme plus soutenu d’environ une dizaine d’ouvertures par an.",
  },
  {
    question:
      "Avez-vous un point de vente pilote dans lequel vous expérimentez votre concept ?",
    answer:
      "Oui. J’ai trois points de vente, j’ai trois salons de beauté aujourd’hui, mais j’expérimente mon concept dans les trois salons. Cependant, je peux dire que le premier salon est celui dans lequel j’expérimente le plus, et je peux l’appeler le centre pilote.",
  },
  {
    question:
      "Y a-t-il un agencement spécifique qui doit être reproduit dans le réseau (plan type, cahier des charges) ?",
    answer:
      "Oui, il y a un agencement spécifique, il existe un cahier des charges précis pour l’aménagement des salons de beauté.",
  },
  {
    question: "Avez-vous un architecte qui pourrait être repris par les affiliés ?",
    answer:
      "Oui, j’ai fait faire les plans par un architecte qui pourrait également travailler pour les franchisés qui rejoindraient mon réseau.",
  },
];

const MIN_ANSWER_LENGTH = 5;

type FetchState = "idle" | "loading" | "success" | "error";

type ApiResponse =
  | { ok: true; text: string }
  | { ok: false; error: string };

export default function HomePage() {
  const [items, setItems] = useState<QA[]>(defaultItems);
  const [status, setStatus] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [contract, setContract] = useState<string>("");

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
          <article>{contract}</article>
        </section>
      )}
    </>
  );
}
