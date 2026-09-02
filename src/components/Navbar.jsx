import { useState, useEffect } from 'react';
import { Menu, X, LogOut, AlertTriangle } from 'lucide-react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoFlash, setLogoFlash] = useState(false);
  const { user, logout } = useAuth();

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
    { name: 'Chat Global', href: '#chat' },
    { name: 'Presentaciones', href: '#links' },
  ];

  const confirmLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setConfirmLogoutOpen(false);
    setMobileMenuOpen(false);
  };

  const triggerLogout = () => {
    setConfirmLogoutOpen(true);
  };

  const handleLogoDoubleClick = () => {
    setLogoFlash(true);
    setLoginOpen(true);
    setTimeout(() => setLogoFlash(false), 500);
  };

  return (
    <>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* Logout Confirmation Modal */}
      {confirmLogoutOpen && (
        <div className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center p-4 overflow-y-auto max-h-screen">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => !loggingOut && setConfirmLogoutOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-sm my-auto py-6 sm:py-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-accent via-white to-accent rounded-sm animate-pulse blur-sm opacity-60"></div>
            <div className="brutalist-panel relative bg-primary-900 border-4 border-white p-6 md:p-8 shadow-[12px_12px_0px_rgba(255,0,0,1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-accent/20 border-2 border-accent flex items-center justify-center">
                  <AlertTriangle size={26} className="md:w-7 md:h-7 text-accent" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase leading-tight">
                  Cerrar Sesión?
                </h3>
              </div>
              <p className="text-white/60 font-bold uppercase tracking-wider text-xs md:text-sm mb-6 md:mb-8 pl-2 border-l-4 border-accent py-2">
                Confirmas que deseas salir del panel de administrador?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => !loggingOut && setConfirmLogoutOpen(false)}
                  disabled={loggingOut}
                  className="px-6 py-4 bg-white/5 border-4 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-colors shadow-[6px_6px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLogout}
                  disabled={loggingOut}
                  className="group relative px-6 py-4 bg-accent text-black font-black uppercase tracking-[0.2em] text-lg overflow-hidden border-4 border-black hover:border-white transition-all disabled:opacity-50 shadow-[8px_8px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loggingOut ? (
                      <>
                        <span className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></span>
                        CERRANDO
                      </>
                    ) : (
                      <>
                        <LogOut size={18} />
                        Sí, Cerrar Sesión
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className={`fixed w-full z-50 transition-all duration-200 ${isScrolled ? 'bg-black/95 backdrop-blur-xl border-b-2 border-accent py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">

          {/* Logo (doble click abre login admin) */}
          <a
            href="#"
            onDoubleClick={handleLogoDoubleClick}
            className="flex items-center gap-3 group select-none"
          >
            <div
              className={`w-10 h-10 md:w-11 md:h-11 rounded-full transition-all flex items-center justify-center border-2 overflow-hidden ${logoFlash
                ? 'border-accent scale-125 shadow-[0_0_20px_rgba(255,0,0,0.9)] ring-2 ring-accent'
                : 'border-white group-hover:border-accent group-hover:scale-105 shadow-[2px_2px_0px_#000]'
                }`}
            >
              <img
                src="/logo.jpeg"
                alt="Kumshot Logo"
                className="w-full h-full object-cover rounded-full"
              />
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
            {user && (
              <button
                onClick={triggerLogout}
                className="px-5 py-2 bg-accent text-black font-black text-xs md:text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 border-2 border-white shadow-[4px_4px_0px_rgba(255,255,255,0.9)] hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <LogOut size={16} className="stroke-[2.5]" />
                <span>SALIR</span>
              </button>
            )}
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
            {user && (
              <button
                onClick={triggerLogout}
                className="mt-4 px-6 py-4 bg-accent text-black font-black text-xl uppercase tracking-widest border-4 border-white transition-colors flex items-center justify-center gap-3 shadow-[8px_8px_0px_rgba(255,255,255,0.9)]"
              >
                <LogOut size={20} />
                CERRAR SESIÓN (ADMIN)
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
