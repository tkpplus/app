import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function About() {
  return (
    <div className="pt-24 min-h-screen bg-background flex flex-col items-center selection:bg-primary/30">
      
      {/* 1. Hero */}
      <section className="relative w-full py-40 px-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-10">
          <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tight leading-[1.1]">
            La Torá no se enseña… <br/>
            <span className="text-primary italic font-serif">se vive.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            Un espacio donde las historias acercan, conectan y dejan huella.
          </p>
          <div className="pt-8">
            <Button size="lg" asChild className="bg-white text-black hover:bg-white/90 font-bold px-10 py-7 rounded-full text-lg shadow-xl shadow-white/5 transition-all duration-300 transform hover:scale-105">
              <Link to="/catalog">
                👉 Explorar TKP+
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Nuestra herencia */}
      <section className="w-full max-w-5xl mx-auto py-32 px-6 text-center">
        <h2 className="text-primary font-bold tracking-widest uppercase mb-12 text-sm md:text-base">Nuestra herencia, cobrando vida</h2>
        
        <div className="space-y-12 text-2xl md:text-4xl text-white font-medium leading-tight max-w-4xl mx-auto font-display">
          <p>
            TKP+ nace de una idea sencilla:<br/>
            crear un lugar para nuestras familias.
          </p>
          <p className="text-text-muted">
            Un espacio donde el contenido importa.<br/>
            Donde cada historia tiene intención.<br/>
            Donde lo que se ve… también forma.
          </p>
          <p>
            Porque creemos que la identidad no se impone.<br/>
            Se construye en lo cotidiano:<br/>
            en lo que escuchamos, en lo que compartimos, en lo que vivimos.
          </p>
        </div>
      </section>

      {/* 3. Backstage */}
      <section className="w-full max-w-6xl mx-auto py-32 px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 order-2 md:order-1">
           <img 
              src="/about.jpg" 
              alt="Backstage TKP+" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1598377706352-78be138c22dc?q=80&w=2670&auto=format&fit=crop";
              }}
            />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        <div className="order-1 md:order-2 space-y-10">
          <h3 className="text-primary font-bold tracking-widest uppercase text-sm">Backstage</h3>
          
          <div className="space-y-8 text-2xl md:text-3xl text-white font-display leading-tight">
            <p>Todo comenzó con una forma distinta de contar:</p>
            <p className="text-primary italic font-serif">“Historias que enseñan, sin decir que enseñan.”</p>
            <p className="text-text-muted">
              Desde ahí, cada episodio se crea con un mismo propósito:<br/>
              que la Torá no se sienta lejana…<br/>
              sino cercana, viva, presente.
            </p>
          </div>
        </div>
      </section>

      {/* 4. La experiencia (Cards) */}
      <section className="w-full py-40 border-y border-white/5 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">La experiencia</h2>
            <p className="text-2xl text-text-muted font-light">Una colección pensada para acompañar distintos momentos en familia.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Original Series", desc: "Las parashot de la semana, contadas con ritmo, claridad y profundidad." },
              { title: "Timeless Stories", desc: "Relatos inspirados en enseñanzas que permanecen." },
              { title: "Holiday Collection", desc: "Contenido para vivir cada jag con intención y alegría." },
              { title: "Everyday Sparks", desc: "Pequeños momentos que aportan luz a lo cotidiano." }
            ].map((item, i) => (
              <div key={i} className="bg-background border border-white/5 rounded-3xl p-10 hover:border-white/10 hover:-translate-y-2 transition-all duration-500 group">
                <h3 className="text-2xl font-display font-medium text-white mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-text-muted text-lg leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Nuestra forma de hacer las cosas */}
      <section className="w-full max-w-4xl mx-auto py-40 px-6 text-center space-y-16">
        <h3 className="text-primary font-bold tracking-widest uppercase text-sm">Nuestra forma de hacer las cosas</h3>
        <div className="space-y-12 text-3xl md:text-5xl font-display font-medium text-white leading-[1.2]">
          <p>
            <span className="text-text-muted">No buscamos simplificar la Torá.</span><br/>
            Buscamos hacerla accesible sin perder su esencia.
          </p>
          <p>
            <span className="text-text-muted">No buscamos llenar el tiempo.</span><br/>
            Buscamos que cada momento tenga sentido.
          </p>
          <p>
            <span className="text-text-muted">No buscamos solo entretener.</span><br/>
            Buscamos que algo permanezca.
          </p>
        </div>
      </section>

      {/* 6. El manifiesto */}
      <section className="w-full max-w-5xl mx-auto py-20 px-6 space-y-20">
        <div className="text-center px-4">
           <h2 className="text-5xl md:text-7xl font-display font-black text-white italic tracking-tight leading-[1.1]">
             “El contenido que ellos disfrutan.<br/>
             La confianza que tú sientes.”
           </h2>
        </div>

        <div className="bg-surface/40 backdrop-blur-sm border border-white/5 p-16 md:p-24 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <h3 className="text-primary font-bold tracking-widest uppercase mb-12 text-sm relative z-10">El manifiesto</h3>
          
          <div className="space-y-12 relative z-10 font-display">
             <p className="text-2xl md:text-3xl text-text-muted font-light leading-relaxed max-w-3xl mx-auto">
                Cada historia, cada detalle y cada decisión dentro de TKP+ está pensada para generar conexión real.
             </p>
             <p className="text-2xl md:text-3xl text-white font-medium">
               Para abrir conversaciones.<br/>
               Para acompañar.<br/>
               Para quedarse.
             </p>
          </div>
        </div>
      </section>

      {/* 7. Cierre */}
      <section className="w-full py-40 flex flex-col items-center text-center px-6 space-y-12">
        <div className="space-y-6 font-display font-medium">
          <h2 className="text-4xl md:text-6xl text-text-muted">
            Hay historias que se ven.<br/>
            Y hay historias que se quedan.
          </h2>
          <p className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            TKP+ es ambas.
          </p>
        </div>
        
        <div className="pt-8">
          <Button size="lg" asChild className="bg-primary text-black hover:bg-primary-hover font-bold px-12 py-8 rounded-full text-xl shadow-[0_0_40px_rgba(245,196,99,0.3)] hover:shadow-[0_0_60px_rgba(245,196,99,0.5)] transition-all duration-500 transform hover:scale-105">
            <Link to="/catalog">
              👉 Empieza a explorar
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}

