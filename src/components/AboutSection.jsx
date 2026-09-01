import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 lg:px-24 border-b-2 border-white/10 bg-black relative overflow-hidden">
      {/* Background Accent Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5 z-0">
        <span className="text-[15vw] font-black text-outline uppercase whitespace-nowrap">
          Quiénes Somos
        </span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">

        {/* Text Content */}
        <div className="flex-1 space-y-8 w-full">
          <div className="flex items-center gap-4">
            <span className="text-accent font-black text-xl animate-strobe-fast">_</span>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-none">
              Quiénes Somos
            </h2>
          </div>

          <div className="w-24 h-2 bg-accent"></div>

          <p className="text-gray-300 text-xl md:text-2xl font-bold uppercase tracking-wide leading-relaxed border-l-4 border-accent pl-6 bg-white/5 py-4 pr-4">
            Grupo de baile que rinde homenaje a LNGSHOT, reconocidos por su colaboración con el solista Jay Park.
          </p>

        </div>

        {/* Visual Element / Image */}
        <div className="flex-1 w-full relative">
          <div className="absolute -inset-4 bg-accent/20 blur-2xl animate-strobe z-0 rounded-full"></div>

          <div className="relative z-10 w-full aspect-[4/3] lg:aspect-video">
            {/* Animated frame */}
            <div className="absolute -inset-2 bg-gradient-to-r from-accent via-white to-accent rounded-sm animate-pulse blur-sm opacity-75"></div>

            <div className="brutalist-panel p-2 relative w-full h-full overflow-hidden bg-primary-800">
              {/* Caution tape corner */}
              <div className="absolute -top-10 -right-10 bg-accent text-black font-black uppercase text-xs py-2 px-12 transform rotate-45 border-y-2 border-black z-20">
                RESTRICTED
              </div>

              <img
                src="/foto2.jpeg"
                alt="Dance Group"
                className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 grayscale hover:grayscale-0"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
