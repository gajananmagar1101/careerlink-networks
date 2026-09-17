import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div id="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
