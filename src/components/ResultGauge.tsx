type Props = {
  value: number;
};

export default function ResultGauge({ value }: Props) {
  return (
    <section className="card result-gauge">
      <p className="eyebrow">総合表示点</p>
      <div className="result-gauge-value">
        <strong>{value}</strong>
        <span>/ 100</span>
      </div>
    </section>
  );
}
