import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-text-main custom-scrollbar">
      <Navbar />
      <main className="flex-1 w-full mx-auto pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
