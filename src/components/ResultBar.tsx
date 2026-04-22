type Props = {
  label: string;
  value: number;
};

export default function ResultBar({ label, value }: Props) {
  return (
    <div className="result-bar-block">
      <div className="result-bar-meta">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="result-bar-track" aria-hidden="true">
        <div className="result-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
