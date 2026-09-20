import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-[#090d11] text-ink dark:text-slate-100 transition-colors">
      <Navbar />
      <main id="main-content" className="px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

