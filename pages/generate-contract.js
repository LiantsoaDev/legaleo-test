import { useState } from 'react';

const emptyPair = { question: '', answer: '' };

export default function GenerateContract() {
  const [qaPairs, setQaPairs] = useState([{ ...emptyPair }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [contractText, setContractText] = useState('');

  const updatePair = (index, field, value) => {
    setQaPairs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addPair = () => {
    setQaPairs((prev) => [...prev, { ...emptyPair }]);
  };

  const removePair = (index) => {
    setQaPairs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setContractText('');

    try {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ qaPairs }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Erreur inconnue.');
      }

      setResult(payload.claudeResponse);
      const textSegments = Array.isArray(payload?.claudeResponse?.content)
        ? payload.claudeResponse.content
            .filter((item) => item.type === 'text' && typeof item.text === 'string')
            .map((item) => item.text)
            .join('\n\n')
        : '';
      setContractText(textSegments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Génération de contrat</h1>
      <p>
        Renseignez les questions et les réponses qui permettront de personnaliser le contrat.
        Le modèle de contrat stocké dans <code>/app/contract/modele_de_contrat.pdf</code> sera envoyé en pièce jointe au prompt
        Claude.
      </p>
      <form onSubmit={handleSubmit}>
        {qaPairs.map((pair, index) => (
          <fieldset key={index} style={{ marginBottom: '1rem' }}>
            <legend>Question {index + 1}</legend>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Question
              <textarea
                value={pair.question}
                onChange={(event) => updatePair(index, 'question', event.target.value)}
                rows={2}
                style={{ width: '100%', marginTop: '0.25rem' }}
                required
              />
            </label>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Réponse
              <textarea
                value={pair.answer}
                onChange={(event) => updatePair(index, 'answer', event.target.value)}
                rows={3}
                style={{ width: '100%', marginTop: '0.25rem' }}
                required
              />
            </label>
            {qaPairs.length > 1 && (
              <button type="button" onClick={() => removePair(index)}>
                Supprimer cette question
              </button>
            )}
          </fieldset>
        ))}
        <button type="button" onClick={addPair} disabled={loading}>
          Ajouter une question
        </button>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Génération en cours...' : 'Générer le contrat'}
          </button>
        </div>
      </form>

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          Erreur : {error}
        </p>
      )}

      {result && (
        <section style={{ marginTop: '2rem' }}>
          <h2>Réponse de Claude</h2>
          {contractText && (
            <article
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                padding: '1rem',
                marginBottom: '1.5rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {contractText}
            </article>
          )}
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f3f3f3', padding: '1rem' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
