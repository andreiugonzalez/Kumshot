import { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { deleteLink } from '../services/linksService';

export default function DeleteLinkModal({ isOpen, onClose, link, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!link || !link.id) {
      setError('ID de presentación no encontrado');
      return;
    }
    setError('');
    setLoading(true);
    const result = await deleteLink(link.id);
    setLoading(false);
    if (result.success) {
      if (onDeleted) onDeleted(link.id);
      onClose();
    } else {
      setError(result.error || 'Error al eliminar');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto max-h-screen">
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
        onClick={() => !loading && onClose()}
      ></div>

      <div className="relative z-10 w-full max-w-md my-auto py-6 sm:py-0">
        <div className="absolute -inset-2 bg-gradient-to-r from-accent via-white to-accent rounded-sm animate-pulse blur-sm opacity-60"></div>

        <div className="brutalist-panel relative bg-primary-900 border-4 border-white p-4 md:p-5 pt-7 md:pt-8 shadow-[12px_12px_0px_rgba(255,0,0,1)]">
          <button
            onClick={() => !loading && onClose()}
            disabled={loading}
            className="absolute top-3 right-3 text-white/50 hover:text-accent hover:rotate-90 transition-all disabled:opacity-50 z-30"
          >
            <X size={26} />
          </button>

          <div className="absolute top-0 left-6 -translate-y-1/2 bg-accent text-black font-black uppercase text-xs py-2 px-8 transform -rotate-3 border-y-4 border-black z-20 shadow-[3px_3px_0px_#000]">
            ELIMINAR
          </div>

          <div className="flex flex-col items-center text-center mb-4 pt-1">
            <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 mb-3 bg-accent/20 border-4 border-accent flex items-center justify-center">
              <Trash2 size={26} className="md:w-7 md:h-7 text-accent" />
            </div>
            <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase leading-none mb-2">
              Eliminar?
            </h3>
            <div className="w-16 h-1.5 bg-accent mb-3"></div>
            {link && (
              <div className="w-full p-3 bg-primary-800 border-l-4 border-accent text-left brutalist-panel">
                <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-1">
                  Presentación a eliminar:
                </p>
                <p className="text-white font-bold uppercase tracking-wide text-xs line-clamp-2 break-words">
                  "{link.title}"
                </p>
                <p className="text-white/40 font-bold uppercase tracking-wider text-[10px] mt-1 break-all line-clamp-1">
                  {link.url}
                </p>
              </div>
            )}
            <div className="flex items-start gap-2 mt-3 text-left">
              <AlertTriangle size={16} className="text-accent shrink-0 mt-0.5" />
              <p className="text-white/70 font-bold uppercase tracking-wider text-xs leading-snug">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-3 p-3 bg-accent/20 border-2 border-accent brutalist-panel">
              <p className="text-white font-bold uppercase tracking-wider text-xs">
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => !loading && onClose()}
              disabled={loading}
              className="px-4 py-3 bg-white/5 border-4 border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors shadow-[6px_6px_0px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="group relative px-4 py-3 bg-accent text-black font-black uppercase tracking-[0.2em] text-base overflow-hidden border-4 border-black hover:border-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[8px_8px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-4 border-black/30 border-t-black rounded-full animate-spin"></span>
                    ELIMINANDO
                  </>
                ) : (
                  <>
                    <Trash2 size={20} />
                    Sí, Eliminar
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
