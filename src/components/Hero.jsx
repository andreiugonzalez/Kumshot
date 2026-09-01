import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Video Background / Flashing Strobe placeholder */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-60 grayscale contrast-125 z-10"
        >
          <source src="/fondoloopnew.mp4" type="video/mp4" />
        </video>

        {/* Flash overlay simulating strobe lights */}
        <div className="absolute inset-0 bg-accent mix-blend-overlay animate-strobe-fast z-20 pointer-events-none"></div>
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black z-30 opacity-90 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center justify-center h-full pt-20">
        
        <div className="glitch-wrapper mb-6">
          <h1 
            className="glitch text-7xl md:text-9xl font-display font-black text-white tracking-tighter leading-none mix-blend-difference" 
            data-text="KUMSHOT"
          >
            KUMSHOT
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-5xl font-black text-accent mb-12 transform -rotate-2 scale-110">
          DANCE COVER
        </h2>
        
        <button 
          onClick={scrollToNext}
          className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xl brutalist-panel overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-200">
            VER MÁS
          </span>
          <div className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer text-white hover:text-accent transition-colors" onClick={scrollToNext}>
        <span className="text-sm uppercase font-black tracking-[0.3em] mb-4 animate-pulse">Baja</span>
        <ChevronDown size={32} className="animate-bounce" />
      </div>
      
    </section>
  )
}
