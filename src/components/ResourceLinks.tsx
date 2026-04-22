import { useMemo, useState } from 'react';
import { resources } from '../data/resources';
import { buildAiConsultationText } from '../lib/export';
import type { AssessmentResult } from '../types/assessment';

type Props = {
  result: AssessmentResult;
};

export default function ResourceLinks({ result }: Props) {
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => buildAiConsultationText(result), [result]);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="card">
      <h2>相談先リンク</h2>
      <p className="muted">
        結果をコピーして、そのまま AI に貼り付けて相談できます。診断目的ではなく、状況整理や相談文づくりの補助として使う想定です。
      </p>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={copyText}>
          結果をAI相談用にコピー
        </button>
        {copied && <span className="copy-badge">コピーしました</span>}
      </div>

      <textarea
        className="ai-textarea"
        value={text}
        readOnly
        aria-label="AI相談用のコピー本文"
      />

      <div className="resource-list">
        {resources.map((resource) => (
          <a
            key={resource.title}
            className="resource-card"
            href={resource.url}
            target={resource.external ? '_blank' : undefined}
            rel={resource.external ? 'noreferrer' : undefined}
          >
            <strong>{resource.title}</strong>
            <span>{resource.description}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
