import PropTypes from 'prop-types';
import { ArrowRight } from 'lucide-react';

export default function InfoSection({ id, title, content, isReversed }) {
  return (
    <section id={id} className={`py-32 px-6 md:px-12 lg:px-24 border-b-2 border-white/10 ${isReversed ? 'bg-primary-800' : 'bg-black'} relative overflow-hidden`}>
      
      {/* Background Accent Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5 z-0">
        <span className="text-[15vw] font-black text-outline uppercase whitespace-nowrap">
          {title}
        </span>
      </div>

      <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
        
        {/* Text Content */}
        <div className="flex-1 space-y-8 w-full">
          <div className="flex items-center gap-4">
            <span className="text-accent font-black text-xl animate-strobe-fast">_</span>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-none">
              {title}
            </h2>
          </div>
          
          <div className="w-24 h-2 bg-accent"></div>
          
          <p className="text-gray-300 text-xl md:text-2xl font-bold uppercase tracking-wide leading-relaxed border-l-4 border-accent pl-6 bg-white/5 py-4 pr-4">
            {content}
          </p>
          
          <button className="flex items-center gap-4 text-white hover:text-black hover:bg-accent transition-colors group mt-12 font-black uppercase tracking-widest text-lg border-2 border-white p-4 brutalist-panel">
            <span>Acceder</span>
            <ArrowRight size={24} className="transform group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Visual Element / Data Placeholder */}
        <div className="flex-1 w-full relative">
          {/* Strobe background element behind panel */}
          <div className="absolute -inset-4 bg-accent/20 blur-2xl animate-strobe z-0 rounded-full"></div>
          
          <div className="brutalist-panel p-8 md:p-12 relative z-10 w-full overflow-hidden">
            {/* Caution tape corner */}
            <div className="absolute -top-10 -right-10 bg-accent text-black font-black uppercase text-xs py-2 px-12 transform rotate-45 border-y-2 border-black">
              RESTRICTED
            </div>
            
            <div className="relative space-y-6">
              <div className="flex justify-between items-end border-b-2 border-white/20 pb-4">
                <span className="text-accent font-black tracking-widest">SYS.STATUS</span>
                <span className="text-white font-bold animate-pulse text-xl">ONLINE</span>
              </div>
              
              <div className="space-y-4">
                <div className="h-6 w-1/3 bg-white/20 border border-white/30"></div>
                <div className="h-6 w-3/4 bg-white/10 border border-white/20"></div>
                <div className="h-6 w-1/2 bg-white/10 border border-white/20"></div>
                <div className="h-6 w-full bg-accent/40 border border-accent"></div>
              </div>
              
              <div className="mt-12 pt-8">
                <div className="text-7xl font-black text-white mb-2 tracking-tighter">
                  100<span className="text-accent">X</span>
                </div>
                <div className="text-sm text-gray-400 font-bold uppercase tracking-[0.3em]">
                  Nivel de Amenaza
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

InfoSection.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  isReversed: PropTypes.bool,
}
