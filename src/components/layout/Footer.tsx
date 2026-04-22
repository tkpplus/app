export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="text-xl font-bold font-display text-primary tracking-tight">
              Torah Kids
            </span>
            <span className="text-xl font-bold font-display text-accent-orange tracking-tight ml-2">
              Puppets
            </span>
            <p className="mt-4 text-sm text-text-muted">
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
              <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Acerca de nosotros</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Canal de YouTube</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Torah Kids Puppets. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-xs text-text-muted">
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
