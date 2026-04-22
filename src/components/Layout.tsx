import { Link, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
      <nav className="floating-nav" aria-label="補助ナビゲーション">
        <Link to="/about">このチェックについて</Link>
        <Link to="/privacy">注意事項</Link>
        <Link to="/help">相談導線</Link>
      </nav>
    </div>
  );
}
