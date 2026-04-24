import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function About() {
  return (
    <div className="pt-16 min-h-screen bg-surface flex flex-col items-center">
      
      {/* 1. Hero tipo manifiesto */}
      <section className="relative w-full py-32 px-6 flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 tracking-tight drop-shadow-xl leading-[1.1]">
            La Torá no se enseña… <br/><span className="text-primary italic">se vive.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
            TKP+ es una plataforma creada para acercar la Torá a una nueva generación, a través de historias, personajes y experiencias que conectan.
          </p>
          <Button size="lg" asChild className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 rounded-lg text-lg shadow-[0_0_30px_rgba(245,196,99,0.3)] hover:scale-105 transition-transform duration-300">
            <Link to="/">
              👉 Explorar contenido
            </Link>
          </Button>
        </div>
      </section>

      {/* 2. Sección “Cómo empezó” */}
      <section className="w-full max-w-6xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/5 order-2 md:order-1">
           {/* Placeholder for puppet backstage */}
           <img src="https://images.unsplash.com/photo-1598377706352-78be138c22dc?q=80&w=2670&auto=format&fit=crop" alt="Backstage Puppets" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent"></div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Todo comenzó <br/>con una idea sencilla:</h2>
          <p className="text-2xl text-primary font-medium italic mb-8">
            "Contar historias que enseñen sin decir que enseñan."
          </p>
          <div className="space-y-6 text-lg text-text-muted leading-relaxed">
            <p>
              Nacimos con una idea clara: que el aprendizaje no tiene que ser aburrido para ser profundo. Por eso creamos contenido donde la enseñanza no se impone… se vive.
            </p>
            <p>
              A través de series, cuentos y episodios, buscamos transmitir valores, identidad y tradición de una manera natural, cercana y significativa para niños y familias.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Sección visual tipo cards */}
      <section className="w-full py-24 bg-black/40 border-y border-white/5 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Lo que hacemos</h2>
            <p className="text-xl text-text-muted">Todo con un enfoque narrativo, visual y emocional.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "🎬 Historias", desc: "Series de parashot adaptadas para niños." },
              { title: "📖 Tradición", desc: "Especiales de festividades y el ciclo del año." },
              { title: "🎭 Personajes", desc: "Cuentos basados en enseñanzas tradicionales." },
              { title: "⚡ Experiencia", desc: "Contenido corto dinámico y formativo." }
            ].map((item, i) => (
              <div key={i} className="bg-surface/50 border border-white/10 rounded-2xl p-8 hover:bg-surface hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-text-muted text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* 4. Mini sección emocional (clave) & Nuestra visión */}
       <section className="w-full max-w-4xl mx-auto py-32 px-6 text-center space-y-16">
          <div className="space-y-6">
             <h2 className="text-5xl md:text-6xl font-display font-black text-white italic tracking-tight">“Cada episodio es una semilla.”</h2>
             <p className="text-2xl text-text-muted font-medium">Buscamos formar, no solo enseñar. Buscamos conectar, no solo entretener.</p>
          </div>

          <div className="bg-gradient-to-b from-surface to-black border border-white/10 p-12 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
            <h3 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm relative z-10">Nuestra visión</h3>
            <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8 relative z-10">
              Creemos en un judaísmo vivo, relevante y lleno de luz. Uno que no solo se estudia… sino que se experimenta.
            </p>
            <p className="text-xl text-text-muted leading-relaxed relative z-10">
              TKP+ no es solo contenido. Es un espacio donde las historias despiertan preguntas, las preguntas generan conexión, y la conexión deja huella.
            </p>
          </div>
      </section>

      {/* 5. CTA final */}
      <section className="w-full pb-32 flex justify-center px-6">
        <div className="text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">¿Listos para la aventura?</h2>
          <Button size="lg" asChild className="bg-primary text-black hover:bg-primary-hover font-bold px-12 py-8 rounded-full text-xl shadow-[0_0_40px_rgba(245,196,99,0.4)] hover:shadow-[0_0_60px_rgba(245,196,99,0.6)] transition-all duration-300 transform hover:scale-105">
            <Link to="/">
              Empieza a explorar TKP+
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
