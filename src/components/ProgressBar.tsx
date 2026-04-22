type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const value = Math.round((current / total) * 100);

  return (
    <section aria-label="進捗" className="card">
      <div className="progress-meta">
        <span>
          {current} / {total}
        </span>
        <span>{value}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </section>
  );
}
