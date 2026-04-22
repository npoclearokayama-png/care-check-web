import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="stack">
      <div className="hero card">
        <p className="eyebrow">匿名・端末内完結</p>
        <h1>3分でできる育児負担セルフチェック</h1>
        <p>
          今のしんどさを整理するための簡単なチェックです。
          診断ではなく、日々の負担感を見つめるためのものです。
        </p>
        <ul className="simple-list">
          <li>個人情報の入力は不要です</li>
          <li>回答はこの端末内で処理されます</li>
          <li>医療的な診断を行うものではありません</li>
        </ul>
        <div className="button-row">
          <Link to="/intro" className="primary-button">
            はじめる
          </Link>
          <Link to="/about" className="secondary-button">
            このチェックについて
          </Link>
        </div>
      </div>
    </section>
  );
}
