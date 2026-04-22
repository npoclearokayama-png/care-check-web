import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="site-title">
          いまの育児負担セルフチェック
        </Link>
        {!isHome && (
          <nav aria-label="メイン">
            <Link to="/intro" className="header-link">
              説明
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
