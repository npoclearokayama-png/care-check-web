type Props = {
  open: boolean;
  onResume: () => void;
  onReset: () => void;
};

export default function ResumeDialog({ open, onResume, onReset }: Props) {
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="resume-title">
      <div className="dialog">
        <h2 id="resume-title">前回の続きがあります</h2>
        <p>この端末には途中保存された回答があります。続きから再開するか、最初からやり直すか選べます。</p>
        <div className="button-row">
          <button type="button" className="primary-button" onClick={onResume}>
            続きから再開
          </button>
          <button type="button" className="secondary-button" onClick={onReset}>
            最初からやり直す
          </button>
        </div>
      </div>
    </div>
  );
}
