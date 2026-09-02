import { useState, useEffect } from 'react';
import { X, Link2, FileText, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { addLink } from '../services/linksService';

const RULES_HINT = `Firestore → Rules pega:
allow read: if true;
allow write, delete, update, create: if request.auth != null;`;

function translateFirestoreError(rawError = '') {
  const msg = String(rawError).toLowerCase();
  if (msg.includes('permission-denied') || msg.includes('insufficient permissions') || msg.includes('unauthorized')) {
    return 'Permiso denegado por Firebase. Revisa las reglas de Firestore Database → Rules.';
  }
  if (msg.includes('not-found') || msg.includes('no document to update')) {
    return 'Documento no encontrado. Refresca y recarga la lista.';
  }
  if (msg.includes('unavailable') || msg.includes('network') || msg.includes('offline')) {
    return 'Sin conexión a internet o Firebase no responde. Revisa la red.';
  }
  if (msg.includes('deadline-exceeded') || msg.includes('timeout')) {
    return 'Tiempo de espera agotado. Intenta nuevamente.';
  }
  if (msg.includes('cancelled')) return 'Operación cancelada.';
  return rawError || 'Error desconocido al guardar.';
}

export default function AddLinkModal({ isOpen, onClose, onAdded }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRulesHint, setShowRulesHint] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setUrl('');
      setError('');
      setSuccess('');
      setLoading(false);
      setShowRulesHint(false);
    }
  }, [isOpen]);

  const validateUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowRulesHint(false);

    if (!title.trim()) {
      setError('Ingresa un título para la presentación');
      return;
    }
    if (!url.trim()) {
      setError('Ingresa una URL');
      return;
    }
    if (!validateUrl(url)) {
      setError('La URL no es válida. Incluye https://');
      return;
    }

    setLoading(true);
    const result = await addLink({ title: title.trim(), url: url.trim() });
    setLoading(false);

    if (result.success) {
      setSuccess('¡Presentación agregada correctamente!');
      setTitle('');
      setUrl('');
      if (onAdded) onAdded();
      setTimeout(() => {
        setSuccess('');
      }, 2500);
    } else {
      const friendly = translateFirestoreError(result.error);
      setError(friendly);
      if (String(result.error).toLowerCase().includes('permission') || String(result.error).toLowerCase().includes('insufficient')) {
        setShowRulesHint(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto max-h-screen">
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-lg my-auto py-6 sm:py-0">
        <div className="absolute -inset-2 bg-gradient-to-r from-accent via-white to-accent rounded-sm animate-pulse blur-sm opacity-60"></div>

        <div className="brutalist-panel relative bg-primary-900 border-4 border-white p-4 md:p-5 pt-7 md:pt-8 shadow-[12px_12px_0px_rgba(255,0,0,1)]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/50 hover:text-accent hover:rotate-90 transition-all z-30"
          >
            <X size={26} />
          </button>

          <div className="absolute top-0 left-6 -translate-y-1/2 bg-accent text-black font-black uppercase text-xs py-2 px-8 transform -rotate-3 border-y-4 border-black z-20 shadow-[3px_3px_0px_#000]">
            NUEVO LINK
          </div>

          <div className="mb-4 pt-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-accent flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#000]">
                <Link2 size={18} className="md:w-5 md:h-5 text-black" />
              </div>
              <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase leading-none">
                Agregar Presentación
              </h2>
            </div>
            <div className="w-16 h-1.5 bg-accent"></div>
          </div>

          {error && (
            <div className="mb-4">
              <div className="p-4 bg-accent/20 border-2 border-accent flex items-start gap-3 brutalist-panel">
                <AlertTriangle size={22} className="text-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                    {error}
                  </p>
                  {showRulesHint && (
                    <button
                      onClick={() => setShowRulesHint((v) => !v)}
                      className="mt-2 text-xs text-accent underline font-black uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      <Info size={12} /> {showRulesHint ? 'Ocultar cómo arreglarlo' : 'Ver cómo arreglarlo'}
                    </button>
                  )}
                </div>
              </div>
              {showRulesHint && (
                <div className="mt-3 p-4 bg-primary-800 border-2 border-accent/40 brutalist-panel">
                  <p className="text-accent font-black uppercase tracking-widest text-[11px] mb-2">
                    SOLUCIÓN RÁPIDA (Firebase Console):
                  </p>
                  <ol className="text-white/80 font-bold uppercase tracking-wider text-[11px] space-y-2 list-decimal list-inside mb-3">
                    <li>Abre → Firestore Database → pestaña Rules</li>
                    <li>Elimina todo y pega las líneas:</li>
                  </ol>
                  <pre className="bg-black border-2 border-white/20 p-2 text-[10px] text-green-400 font-mono whitespace-pre-wrap break-all mb-2">
{RULES_HINT}
                  </pre>
                  <div className="flex items-center justify-between">
                    <p className="text-accent font-black uppercase tracking-widest text-[10px]">
                      Click Publicar
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(RULES_HINT);
                      }}
                      className="px-3 py-1 bg-accent text-black text-[10px] border border-black font-black uppercase tracking-widest hover:bg-accent-light transition-colors"
                    >
                      COPIAR
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border-2 border-green-500 flex items-start gap-2 brutalist-panel">
              <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
              <p className="text-white font-bold uppercase tracking-wider text-xs">
                {success}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 font-black uppercase tracking-widest text-[10px] mb-2">
                Título de la Presentación
              </label>
              <div className="relative">
                <FileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Presentacion KUMSHOT - WINTER STAGE"
                  className="w-full bg-primary-800 border-2 border-white/20 text-white px-10 py-3 text-sm font-bold tracking-wider placeholder:text-white/30 focus:border-accent focus:outline-none brutalist-panel shadow-[4px_4px_0px_rgba(255,0,0,0.5)] focus:shadow-[4px_4px_0px_rgba(255,0,0,1)] transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 font-black uppercase tracking-widest text-[10px] mb-2">
                URL del Video / Enlace
              </label>
              <div className="relative">
                <Link2 size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-primary-800 border-2 border-white/20 text-white px-10 py-3 text-sm font-bold tracking-wider placeholder:text-white/30 focus:border-accent focus:outline-none brutalist-panel shadow-[4px_4px_0px_rgba(255,0,0,0.5)] focus:shadow-[4px_4px_0px_rgba(255,0,0,1)] transition-shadow"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/5 border-4 border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors shadow-[6px_6px_0px_rgba(255,255,255,0.1)] hover:-translate-y-0.5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 group relative px-4 py-3 bg-accent text-black font-black uppercase tracking-[0.2em] text-base overflow-hidden border-4 border-black hover:border-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[8px_8px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></span>
                      GUARDANDO
                    </>
                  ) : (
                    <>
                      AGREGAR
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
