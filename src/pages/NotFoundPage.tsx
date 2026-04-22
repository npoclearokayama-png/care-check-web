import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="stack">
      <div className="card">
        <h1>ページが見つかりません</h1>
        <p>URLが正しくない可能性があります。トップページから開き直してください。</p>
        <Link to="/" className="primary-button">
          トップへ戻る
        </Link>
      </div>
    </section>
  );
}
