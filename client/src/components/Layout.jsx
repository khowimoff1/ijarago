import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Bosh sahifada hero navbar ostidan boshlanadi, boshqa sahifalarda joy qoldiramiz */}
      <main className={`flex-1 ${pathname === '/' ? '' : 'pt-[72px]'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
