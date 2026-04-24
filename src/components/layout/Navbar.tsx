import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchOverlay } from './SearchOverlay';

export function Navbar() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="Torah Kids Puppets Logo" className="h-10 w-auto" />
                <div className="font-logo font-bold text-3xl tracking-tight select-none flex items-center mb-1">
                  <span className="text-primary">TKP</span>
                  <span className="text-white font-black">+</span>
                </div>
              </Link>
              
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-1">
                  <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-text-main hover:bg-background transition-colors">
                    Inicio
                  </Link>
                  <Link to="/category/parashot" className="px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:text-text-main hover:bg-background transition-colors">
                    Parashot
                  </Link>
                  <Link to="/category/festividades" className="px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:text-text-main hover:bg-background transition-colors">
                    Festividades
                  </Link>
                  <Link to="/category/cuentos" className="px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:text-text-main hover:bg-background transition-colors">
                    Cuentos
                  </Link>
                  <Link to="/mi-lista" className="px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:text-text-main hover:bg-background transition-colors">
                    Mi Lista
                  </Link>
                  <Link to="/shorts" className="px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:text-text-main hover:bg-background transition-colors flex items-center gap-1">
                    Shorts
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-text-muted hover:text-primary transition-colors p-2 hover:scale-110 transform"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
