import { ExternalLink } from 'lucide-react';

export default function LinksSection() {
  const manualLinks = [
    { title: "Presentacion kumshot - 4SHO 4SHO - YEAH YEAH - THE PURGE | WINTER STAGE", url: "https://www.youtube.com/watch?v=j4HfNPyl5F4" },
    { title: "Presentacion kumshot - 4SHO 4SHO -YEAH YEAH - THE PURGE | koreanity", url: "https://www.youtube.com/watch?v=kf-4yQV3gIk" },
  ];

  return (
    <section id="links" className="py-32 px-6 md:px-12 lg:px-24 border-b-2 border-white/10 bg-black relative overflow-hidden">
      
      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
        >
          <source src="/facetime.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-none">
              Presentaciones
            </h2>
          </div>
          <div className="w-24 h-2 bg-accent"></div>
        </div>

        <div className="space-y-6">
          {manualLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 bg-primary-800 border-2 border-white/20 hover:border-accent brutalist-panel transition-all"
            >
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <span className="text-accent font-black text-2xl">0{index + 1}</span>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider group-hover:text-accent transition-colors">
                  {link.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors uppercase font-black tracking-widest text-sm">
                VER AHORA <ExternalLink size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
