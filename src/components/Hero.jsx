import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black selection:bg-accent selection:text-black">
      {/* Video Background / Flashing Strobe placeholder */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-50 grayscale contrast-150 z-10"
        >
          <source src="/fondoloopnew.mp4" type="video/mp4" />
        </video>

        {/* Flash overlay simulating strobe lights */}
        <div className="absolute inset-0 bg-accent mix-blend-overlay animate-strobe-fast z-20 pointer-events-none"></div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black z-30 opacity-90 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 text-center px-4 w-full max-w-6xl mx-auto flex flex-col items-center justify-center h-full pt-12">
        {/* Main Aggressive Glitch Title */}
        <div className="glitch-wrapper relative mb-8 select-none">
          {/* Background Huge Outline Text */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[18vw] font-display font-black text-outline uppercase opacity-15 pointer-events-none whitespace-nowrap">
            KUMSHOT
          </span>

          <h1
            className="glitch-intense text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display font-black text-white tracking-tighter leading-none uppercase drop-shadow-[0_0_40px_rgba(255,0,0,0.8)]"
            data-text="KUMSHOT"
          >
            KUMSHOT
          </h1>
        </div>

        {/* Smaller Action Button */}
        <button
          onClick={scrollToNext}
          className="group relative px-7 py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-sm md:text-base border-2 border-black hover:border-accent transition-all shadow-[4px_4px_0px_rgba(255,0,0,1)] hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-200">
            VER MÁS <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
          </span>
          <div className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer text-white hover:text-accent transition-colors group"
        onClick={scrollToNext}
      >
        <span className="text-xs uppercase font-black tracking-[0.3em] mb-1.5 group-hover:tracking-[0.4em] transition-all animate-pulse">
          BAJA
        </span>
        <ChevronDown size={24} className="animate-bounce text-accent" />
      </div>
    </section>
  );
}
