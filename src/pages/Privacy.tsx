export function Privacy() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface px-6">
      <div className="max-w-4xl mx-auto bg-black/40 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-4xl font-display font-bold text-white mb-8">Política de Privacidad</h1>
        
        <div className="space-y-6 text-text-muted leading-relaxed">
          <p>
            En Torah Kids Puppets (TKP+), nos tomamos muy en serio la privacidad de nuestros usuarios, especialmente porque gran parte de nuestra audiencia son familias y niños.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Recopilación y almacenamiento de información</h2>
          <p>
            Al utilizar nuestra plataforma, recopilamos información sobre el progreso y la interacción con los videos (para la función de "Continuar viendo" y "Mi Lista"). Esta información se almacena localmente en su dispositivo (mediante LocalStorage y tecnologías similares) y en nuestros sistemas internos para sincronizar su experiencia y asegurar que nunca pierda su progreso de visualización, brindando una experiencia de streaming continua y personalizada.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Uso de la información</h2>
          <p>
            La información almacenada se utiliza exclusivamente para mejorar su experiencia dentro de la plataforma (ej. recordar en qué minuto se quedó viendo un episodio). Esta información reside en el navegador de su dispositivo.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Servicios de terceros</h2>
          <p>
            Nuestro contenido es reproducido mediante el reproductor de YouTube, el cual cuenta con sus propias políticas de privacidad. Al reproducir estos videos, se aplican los términos y privacidad estándar de YouTube (Google LLC).
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Contacto</h2>
          <p>
            Si tiene alguna pregunta sobre nuestras prácticas de privacidad, puede contactarnos a través de nuestros canales oficiales o enviando un correo a hola@torahkidspuppets.com.
          </p>
        </div>
      </div>
    </div>
  );
}
