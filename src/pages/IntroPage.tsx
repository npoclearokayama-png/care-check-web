import { Link } from 'react-router-dom';

export default function IntroPage() {
  return (
    <section className="stack">
      <div className="card">
        <h1>チェックの前に</h1>
        <p>
          このチェックは、今の育児負担を大まかに整理するためのセルフチェックです。
          正確な診断や判定を行うものではありません。
        </p>
        <p>
          24問に、5件法で答えていきます。回答はブラウザ内で処理され、外部送信は行いません。
          途中で閉じても、この端末では続きから再開できます。
        </p>
        <div className="button-row">
          <Link to="/check" className="primary-button">
            チェックを始める
          </Link>
          <Link to="/" className="secondary-button">
            戻る
          </Link>
        </div>
      </div>
    </section>
  );
}
