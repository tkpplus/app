import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 inline-flex">
              <img src="/logo.png" alt="Torah Kids Puppets Logo" className="h-8 w-auto grayscale mix-blend-screen opacity-70" />
              <div className="font-display font-bold text-2xl tracking-tight select-none flex items-center mb-0.5 opacity-90">
                <span className="text-primary">TKP</span>
                <span className="text-white font-black">+</span>
              </div>
            </Link>
            <p className="text-sm text-text-muted mt-2">
              Educación judía entretenida y accesible para niños y familias en todo el mundo.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-text-main mb-4 font-display tracking-wide uppercase text-sm">Explorar</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Parashot</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Festividades</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Cuentos</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text-main mb-4 font-display tracking-wide uppercase text-sm">Plataforma</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-text-muted hover:text-primary transition-colors">Acerca de nosotros</Link></li>
              <li><a href="https://youtube.com/@torahkidspuppets" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-primary transition-colors">Canal de YouTube</a></li>
              <li><a href="mailto:hola@torahkidspuppets.com" className="text-sm text-text-muted hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Torah Kids Puppets. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-xs text-text-muted">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacidad</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
