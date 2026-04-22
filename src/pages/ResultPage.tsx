import { Link, Navigate } from 'react-router-dom';
import ActionTips from '../components/ActionTips';
import ResourceLinks from '../components/ResourceLinks';
import ResultBar from '../components/ResultBar';
import ResultGauge from '../components/ResultGauge';
import { scaleLabels } from '../data/resultRules';
import { printResult } from '../lib/export';
import { clearSession, loadResult } from '../lib/storage';

export default function ResultPage() {
  const result = loadResult();

  if (!result) {
    return <Navigate to="/" replace />;
  }

  function handleRetry() {
    clearSession();
  }

  return (
    <section className="stack">
      <section className="card">
        <h1>{result.summaryTitle}</h1>
      </section>

      <ResultGauge value={result.totalNormalized} />

      <section className="card">
        <h2>総合メッセージ</h2>
        <p>{result.summaryMessage}</p>
      </section>

      <section className="card">
        <h2>領域別結果</h2>
        <div className="stack-sm">
          <ResultBar label={scaleLabels.child_load} value={result.scales.child_load.normalized} />
          <ResultBar label={scaleLabels.parent_fatigue} value={result.scales.parent_fatigue.normalized} />
          <ResultBar
            label={scaleLabels.isolation_support}
            value={result.scales.isolation_support.normalized}
          />
          <ResultBar
            label={scaleLabels.future_uncertainty}
            value={result.scales.future_uncertainty.normalized}
          />
        </div>
      </section>

      <section className="card">
        <h2>高い領域2つの解説</h2>
        <div className="stack-sm">
          {result.topScales.map((scale) => (
            <div key={scale} className="soft-panel">
              <strong>{scaleLabels[scale]}</strong>
              <p>{result.scaleMessages[scale]}</p>
            </div>
          ))}
        </div>
      </section>

      <ActionTips tips={result.tips} />
      <ResourceLinks result={result} />

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={printResult}>
          結果を印刷
        </button>
        <Link to="/check" className="primary-button" onClick={handleRetry}>
          もう一度やる
        </Link>
      </div>
    </section>
  );
}
