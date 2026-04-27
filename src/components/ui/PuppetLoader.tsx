import { useState, useEffect } from 'react';

const puppets = [
  { name: 'Yosef', action: 'está preparando el video...' },
  { name: 'Benny', action: 'está buscando el capítulo...' },
  { name: 'Aharón', action: 'está ajustando las luces...' },
  { name: 'Ezra', action: 'está trayendo las palomitas...' },
  { name: 'Arush', action: 'está afinando su instrumento...' },
  { name: 'Keter', action: 'está leyendo el libreto...' },
  { name: 'Avraham', action: 'está listo para la acción...' },
];

export function PuppetLoader() {
  const [puppetIndex, setPuppetIndex] = useState(0);

  useEffect(() => {
    // Pick a random puppet on mount
    setPuppetIndex(Math.floor(Math.random() * puppets.length));
    
    // Cycle every 3 seconds if it keeps loading
    const interval = setInterval(() => {
      setPuppetIndex((prev) => (prev + 1) % puppets.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const currentPuppet = puppets[puppetIndex];

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 animate-in fade-in duration-500">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Colorful bouncing elements representing the puppets */}
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-2 border-4 border-t-primary border-r-accent-orange border-b-primary border-l-transparent rounded-full animate-[spin_1.5s_ease-in-out_infinite]" />
        <div className="text-2xl animate-bounce">🎬</div>
      </div>
      <p className="text-white/80 font-medium text-lg text-center font-display tracking-wide animate-pulse">
        <span className="text-primary font-bold">{currentPuppet.name}</span> {currentPuppet.action}
      </p>
    </div>
  );
}
