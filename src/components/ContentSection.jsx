import { Play, Link as LinkIcon } from 'lucide-react';

export default function ContentSection() {
  return (
    <section id="content" className="py-32 px-6 md:px-12 lg:px-24 border-b-2 border-white/10 bg-primary-800 relative overflow-hidden">
      
      {/* Background Accent Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5 z-0">
        <span className="text-[15vw] font-black text-outline uppercase whitespace-nowrap">
          Contenido
        </span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Text Content */}
        <div className="flex-1 space-y-8 w-full">
          <div className="flex items-center gap-4">
            <span className="text-accent font-black text-xl animate-strobe-fast">_</span>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-none">
              Contenido
            </h2>
          </div>
          
          <div className="w-24 h-2 bg-accent"></div>
          
          <p className="text-gray-300 text-xl md:text-2xl font-bold uppercase tracking-wide leading-relaxed border-r-4 border-accent pr-6 bg-white/5 py-4 pl-4 text-right">
            SÍGUENOS EN NUESTRAS REDES SOCIALES PARA CONTENIDO EXCLUSIVO, DETRÁS DE ESCENAS Y PRÓXIMAS PRESENTACIONES.
          </p>
          
          <div className="flex flex-col gap-4 mt-12">
            <a href="https://www.instagram.com/kum4shot/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-white hover:text-black hover:bg-accent transition-colors group font-black uppercase tracking-widest text-lg border-2 border-white p-4 brutalist-panel">
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height="24" width="24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                INSTAGRAM
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
            <a href="https://www.tiktok.com/@kumshot4show" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-white hover:text-black hover:bg-accent transition-colors group font-black uppercase tracking-widest text-lg border-2 border-white p-4 brutalist-panel">
              <span className="flex items-center gap-3">
                {/* TikTok SVG Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                </svg>
                TIK TOK
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
            <a href="#" className="flex items-center justify-between text-white hover:text-black hover:bg-accent transition-colors group font-black uppercase tracking-widest text-lg border-2 border-white p-4 brutalist-panel">
              <span className="flex items-center gap-3"><LinkIcon size={24} /> OTRO ENLACE</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
          </div>
        </div>

        {/* Visual Element / Video Placeholder */}
        <div className="flex-1 w-full relative">
          <div className="absolute -inset-4 bg-accent/20 blur-2xl animate-strobe z-0 rounded-full"></div>
          
          <div className="brutalist-panel p-2 relative z-10 w-full max-w-sm mx-auto aspect-[9/16] overflow-hidden bg-black flex items-center justify-center group cursor-pointer">
            {/* Caution tape corner */}
            <div className="absolute -bottom-10 -left-10 bg-accent text-black font-black uppercase text-xs py-2 px-12 transform -rotate-45 border-y-2 border-black z-20">
              MEDIA
            </div>
            
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            >
              <source src="/tiktok.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

      </div>
    </section>
  )
}
