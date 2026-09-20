import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-[#090d11] text-ink dark:text-slate-100 transition-colors">
      <Navbar />
      <div id="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
