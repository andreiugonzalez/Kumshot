import { useState, useEffect } from 'react';
import { X, Lock, User, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos');
      setLoading(false);
      return;
    }

    const email = username === 'kum4shot' ? 'kum4shot@kumshot.com' : username;

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto max-h-screen">
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-md my-auto py-6 sm:py-0 animate-[strobe_0.3s_ease-out]">
        <div className="absolute -inset-2 bg-gradient-to-r from-accent via-white to-accent rounded-sm animate-pulse blur-sm opacity-60"></div>

        <div className="brutalist-panel relative bg-primary-900 border-4 border-white p-6 md:p-8 pt-8 md:pt-10 shadow-[12px_12px_0px_rgba(255,0,0,1)]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/50 hover:text-accent hover:rotate-90 transition-all z-30"
          >
            <X size={26} />
          </button>

          <div className="absolute top-0 left-6 -translate-y-1/2 bg-accent text-black font-black uppercase text-xs py-2 px-8 transform -rotate-3 border-y-4 border-black z-20 shadow-[3px_3px_0px_#000]">
            ADMIN ACCESS
          </div>

          <div className="mb-6 md:mb-8 pt-2">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#000]">
                <Lock size={22} className="md:w-6 md:h-6 text-black" />
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase leading-none">
                Ingresar
              </h2>
            </div>
            <div className="w-24 h-2 bg-accent"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-accent/20 border-2 border-accent flex items-start gap-3 brutalist-panel">
              <AlertTriangle size={22} className="text-accent shrink-0 mt-0.5" />
              <p className="text-white font-bold uppercase tracking-wider text-sm">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/70 font-black uppercase tracking-widest text-xs mb-3">
                Nombre de usuario
              </label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kum4show"
                  className="w-full bg-primary-800 border-2 border-white/20 text-white px-12 py-4 font-bold uppercase tracking-wider placeholder:text-white/30 focus:border-accent focus:outline-none brutalist-panel shadow-[4px_4px_0px_rgba(255,0,0,0.5)] focus:shadow-[4px_4px_0px_rgba(255,0,0,1)] transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 font-black uppercase tracking-widest text-xs mb-3">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-primary-800 border-2 border-white/20 text-white pl-12 pr-12 py-4 font-bold tracking-wider placeholder:text-white/30 focus:border-accent focus:outline-none brutalist-panel shadow-[4px_4px_0px_rgba(255,0,0,0.5)] focus:shadow-[4px_4px_0px_rgba(255,0,0,1)] transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-accent transition-colors p-1"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full px-8 py-5 bg-accent text-black font-black uppercase tracking-[0.25em] text-xl overflow-hidden border-4 border-black hover:border-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[8px_8px_0px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></span>
                    ACCEDIENDO
                  </>
                ) : (
                  <>
                    ACCEDER
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-white/10 text-center">
            <p className="text-white/30 font-black uppercase tracking-widest text-xs">
              SISTEMA RESTRINGIDO • KUMSHOT SYNDICATE
            </p>
            <div className="mt-2 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-accent animate-strobe-fast"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
