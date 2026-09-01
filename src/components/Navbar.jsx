import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Quiénes Somos', href: '#about' },
    { name: 'Contenido', href: '#content' },
    { name: 'Presentaciones', href: '#links' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-200 ${isScrolled ? 'bg-black/95 backdrop-blur-xl border-b-2 border-accent py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white group-hover:bg-accent transition-colors flex items-center justify-center border-2 border-black group-hover:border-white">
            <span className="text-black group-hover:text-white font-black text-2xl uppercase font-display leading-none mt-1">K</span>
          </div>
          <span className="text-white font-display font-black tracking-[0.2em] text-2xl uppercase hidden sm:block group-hover:text-accent transition-colors">
            Kumshot
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-white hover:text-accent text-sm font-black uppercase tracking-[0.2em] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
          ))}
          <button className="brutalist-panel px-8 py-3 bg-accent text-black font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Ingresar
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white hover:text-accent transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b-4 border-accent py-6 px-6 flex flex-col gap-6 shadow-[0_20px_50px_rgba(255,0,0,0.2)]">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-white hover:text-accent text-2xl font-black uppercase tracking-widest py-2 border-b-2 border-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button className="mt-6 px-6 py-4 bg-accent text-black font-black text-xl uppercase tracking-widest border-2 border-transparent hover:border-white transition-colors">
            Ingresar al Sistema
          </button>
        </div>
      )}
    </nav>
  )
}
