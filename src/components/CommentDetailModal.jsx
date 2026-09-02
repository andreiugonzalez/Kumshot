import { useState } from 'react';
import { X, MessageSquare, Calendar, User, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { deleteComment } from '../services/commentsService';

export default function CommentDetailModal({ isOpen, onClose, comment, onDeleted }) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !comment) return null;

  const formatDate = (dateVal) => {
    if (!dateVal) return 'Reciente';
    try {
      const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Reciente';
    }
  };

  const handleDelete = async () => {
    setError('');
    setDeleting(true);
    const result = await deleteComment(comment.id);
    setDeleting(false);

    if (result.success) {
      if (onDeleted) onDeleted(comment.id);
      setConfirmDelete(false);
      onClose();
    } else {
      setError(result.error || 'Error al eliminar el comentario');
    }
  };

  const handleClose = () => {
    setConfirmDelete(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto max-h-screen">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
        onClick={handleClose}
      ></div>

      <div className="relative z-10 w-full max-w-lg my-auto py-6 sm:py-0">
        <div className="absolute -inset-2 bg-gradient-to-r from-accent via-white to-accent rounded-sm animate-pulse blur-sm opacity-60"></div>

        <div className="brutalist-panel relative bg-primary-900 border-4 border-white p-6 md:p-8 pt-8 md:pt-10 shadow-[12px_12px_0px_rgba(255,0,0,1)]">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/50 hover:text-accent hover:rotate-90 transition-all z-30"
          >
            <X size={26} />
          </button>

          <div className="absolute top-0 left-6 -translate-y-1/2 bg-accent text-black font-black uppercase text-xs py-2 px-6 transform -rotate-2 border-y-4 border-black z-20 shadow-[3px_3px_0px_#000]">
            DETALLE DEL MENSAJE
          </div>

          <div className="mb-4 pt-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_#000]">
                <User size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase leading-none">
                  {comment.name}
                </h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-accent/20 border border-accent text-accent text-[10px] font-black uppercase tracking-widest">
                  {comment.category || 'Comentario'}
                </span>
              </div>
            </div>
            <div className="w-16 h-1.5 bg-accent mt-3"></div>
          </div>

          {error && (
            <div className="my-3 p-3 bg-accent/20 border-2 border-accent flex items-start gap-2">
              <AlertTriangle size={18} className="text-accent shrink-0 mt-0.5" />
              <p className="text-white font-bold uppercase tracking-wider text-xs">{error}</p>
            </div>
          )}

          <div className="my-6 p-5 bg-primary-800 border-2 border-white/20 brutalist-panel">
            <p className="text-white font-bold uppercase text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
              "{comment.comment}"
            </p>
          </div>

          <div className="flex items-center justify-between text-white/40 text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-accent" />
              {formatDate(comment.createdAt)}
            </span>
            <span className="flex items-center gap-1 text-accent font-black">
              <MessageSquare size={14} /> KUMSHOT CHAT
            </span>
          </div>

          {/* Admin Delete Confirmation Overlay / Controls */}
          {user && (
            <div className="mt-6 border-t-2 border-accent/40 pt-4">
              {confirmDelete ? (
                <div className="p-4 bg-accent/15 border-2 border-accent text-center space-y-3">
                  <p className="text-white font-black uppercase tracking-widest text-xs">
                    ¿Confirmas que deseas eliminar este comentario?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleting}
                      className="flex-1 py-2 bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 py-2 bg-accent text-black font-black uppercase tracking-widest text-xs border border-black hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      {deleting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> ELIMINANDO
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} /> SÍ, ELIMINAR
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-3 bg-accent/20 border-2 border-accent text-accent font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> ELIMINAR COMENTARIO (ADMIN)
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleClose}
            className="mt-4 w-full py-3 bg-white/10 border-2 border-white/30 text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.2)]"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
}
