import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Evitar que el usuario haga scroll mientras la animación inicial se reproduce
    document.body.style.overflow = 'hidden';
    
    // Tiempos ajustados para dar un efecto premium y cinemático
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = '';
        onComplete();
      }, 1200); // Tiempo de la transición de salida (fade out)
    }, 3800); // Duración total de la cortinilla

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex flex-col justify-center items-center bg-[#050505]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            className="relative flex flex-col items-center"
          >
            {/* Resplandor sutil (Glow) detrás del logo */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-150 animate-pulse pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 4, ease: "linear" }}
              className="relative z-10 flex flex-col items-center"
            >
              <img 
                src="/logo.png" 
                alt="TKP+ Logo" 
                className="w-24 md:w-32 h-auto object-contain grayscale mix-blend-screen opacity-90 drop-shadow-2xl" 
              />
              
              <div className="mt-6 flex items-center font-display font-bold text-4xl md:text-6xl tracking-tight drop-shadow-xl select-none">
                <span className="text-primary">TKP</span>
                <span className="text-white">+</span>
              </div>

              {/* Subtítulo elegante tipo firma de casa productora */}
              <motion.div
                  initial={{ opacity: 0, letterSpacing: '0.1em' }}
                  animate={{ opacity: 1, letterSpacing: '0.4em' }}
                  transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                  className="mt-6 text-[10px] md:text-xs text-white/40 uppercase font-medium"
              >
                  Originals
              </motion.div>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
