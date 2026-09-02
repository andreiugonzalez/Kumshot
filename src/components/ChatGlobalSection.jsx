import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Sparkles, User, AlertTriangle, CheckCircle, Info, Flame, Shuffle, Grid, Move, Trash2 } from 'lucide-react';
import { addComment, subscribeComments, deleteComment } from '../services/commentsService';
import CommentDetailModal from './CommentDetailModal';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Petición de baile',
  'Comentario',
  'Saludo',
  'Sugerencia',
];

const RULES_HINT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /presentation_links/{link} {
      allow read: if true;
      allow write, delete, update, create: if request.auth != null;
    }
    match /global_comments/{comment} {
      allow read, create: if true;
      allow write, delete, update: if request.auth != null;
    }
  }
}`;

export default function ChatGlobalSection() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('Petición de baile');
  const [allComments, setAllComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [showRulesHint, setShowRulesHint] = useState(false);
  const [viewMode, setViewMode] = useState('floating');

  // Physics animation state
  const containerRef = useRef(null);
  const [floatingCards, setFloatingCards] = useState([]);
  const hoveredIndexRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeComments(
      (data, live) => {
        setAllComments(data);
        setIsLive(live);
      },
      (err) => {
        console.warn('Firestore subscription warning:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  const initializeFloatingCards = (commentsList) => {
    if (!commentsList || commentsList.length === 0) return;

    const containerWidth = containerRef.current?.clientWidth || 600;
    const containerHeight = containerRef.current?.clientHeight || 500;

    const cardW = 200;
    const cardH = 135;

    const shuffled = [...commentsList].sort(() => 0.5 - Math.random());
    const subset = shuffled.slice(0, Math.min(8, commentsList.length));

    const initial = subset.map((item, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);

      const startX = Math.min(
        containerWidth - cardW - 10,
        Math.max(10, col * 210 + Math.random() * 30)
      );
      const startY = Math.min(
        containerHeight - cardH - 10,
        Math.max(10, row * 140 + Math.random() * 30)
      );

      const vx = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.8);
      const vy = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.7);

      return {
        ...item,
        x: startX,
        y: startY,
        vx,
        vy,
        width: cardW,
        height: cardH,
      };
    });

    setFloatingCards(initial);
  };

  useEffect(() => {
    if (allComments.length > 0 && viewMode === 'floating') {
      initializeFloatingCards(allComments);
    }
  }, [allComments, viewMode]);

  useEffect(() => {
    if (viewMode !== 'floating' || floatingCards.length === 0) return;

    let animId;

    const step = () => {
      const containerW = containerRef.current?.clientWidth || 600;
      const containerH = containerRef.current?.clientHeight || 500;

      setFloatingCards((prevCards) => {
        if (!prevCards || prevCards.length === 0) return prevCards;

        const updated = prevCards.map((card, index) => {
          if (hoveredIndexRef.current === index) {
            return card;
          }

          let newX = card.x + card.vx;
          let newY = card.y + card.vy;
          let newVx = card.vx;
          let newVy = card.vy;

          if (newX <= 5) {
            newX = 5;
            newVx = Math.abs(card.vx);
          } else if (newX + card.width >= containerW - 5) {
            newX = containerW - card.width - 5;
            newVx = -Math.abs(card.vx);
          }

          if (newY <= 5) {
            newY = 5;
            newVy = Math.abs(card.vy);
          } else if (newY + card.height >= containerH - 5) {
            newY = containerH - card.height - 5;
            newVy = -Math.abs(card.vy);
          }

          return {
            ...card,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });

        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const c1 = updated[i];
            const c2 = updated[j];

            const overlapX =
              c1.x < c2.x + c2.width && c1.x + c1.width > c2.x;
            const overlapY =
              c1.y < c2.y + c2.height && c1.y + c1.height > c2.y;

            if (overlapX && overlapY) {
              const tempVx = c1.vx;
              const tempVy = c1.vy;

              updated[i].vx = c2.vx;
              updated[i].vy = c2.vy;

              updated[j].vx = tempVx;
              updated[j].vy = tempVy;

              updated[i].x += updated[i].vx * 2;
              updated[i].y += updated[i].vy * 2;
            }
          }
        }

        return updated;
      });

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, floatingCards.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Por favor ingresa tu nombre o apodo.');
      return;
    }
    if (!comment.trim()) {
      setError('Por favor escribe tu comentario o petición.');
      return;
    }

    setSubmitting(true);
    const result = await addComment({ name, comment, category });
    setSubmitting(false);

    if (result.success) {
      if (result.isLocal) {
        setSuccess('¡Comentario publicado correctamente! (Guardado localmente)');
        setShowRulesHint(true);
      } else {
        setSuccess('¡Tu mensaje ha sido publicado en la nube!');
      }
      setName('');
      setComment('');
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError('No se pudo enviar el comentario. Inténtalo nuevamente.');
    }
  };

  const handleCardClick = (item) => {
    setSelectedComment(item);
    setModalOpen(true);
  };

  const handleDirectDelete = async (e, id) => {
    e.stopPropagation(); // prevent opening detail modal
    const result = await deleteComment(id);
    if (result.success) {
      setAllComments((prev) => prev.filter((c) => c.id !== id));
      setFloatingCards((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const formatDateShort = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <section id="chat" className="py-28 px-6 md:px-12 lg:px-24 border-b-2 border-white/10 bg-primary-800 relative overflow-hidden">
      <CommentDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        comment={selectedComment}
        onDeleted={(deletedId) => {
          setAllComments((prev) => prev.filter((c) => c.id !== deletedId));
          setFloatingCards((prev) => prev.filter((c) => c.id !== deletedId));
        }}
      />

      {/* Background Accent Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5 z-0">
        <span className="text-[14vw] font-black text-outline uppercase whitespace-nowrap">
          CHAT GLOBAL
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-black text-xl animate-strobe-fast">_</span>
            <h2 className="text-4xl md:text-7xl font-display font-black text-white uppercase leading-none tracking-tight">
              Chat Global / Peticiones
            </h2>
          </div>
          <div className="w-24 h-2 bg-accent mb-4"></div>
          <p className="text-gray-300 text-base md:text-xl font-bold uppercase tracking-wide max-w-3xl">
            ¡Deja tus peticiones de baile o comentarios! Los mensajes flotan en tiempo real.
          </p>
          {user && (
            <p className="mt-2 text-accent font-black uppercase tracking-widest text-xs border border-accent/40 bg-accent/10 px-4 py-1.5 inline-block">
              MODO ADMIN ACTIVO • PUEDES ELIMINAR COMENTARIOS
            </p>
          )}
        </div>

        {/* Main Grid: Form Left, Physics Floating Canvas Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Form Column (5 cols) */}
          <div className="lg:col-span-5 bg-primary-900 border-4 border-white p-6 md:p-7 brutalist-panel relative shadow-[10px_10px_0px_rgba(255,0,0,1)]">
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-accent text-black font-black uppercase text-xs py-1.5 px-6 border-y-2 border-black z-20 shadow-[2px_2px_0px_#000]">
              NUEVO MENSAJE
            </div>

            <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase mb-5 pt-1 flex items-center gap-2">
              <MessageSquare className="text-accent" size={22} /> Escribe un Comentario
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-accent/20 border-2 border-accent flex items-start gap-2 brutalist-panel">
                <AlertTriangle size={18} className="text-accent shrink-0 mt-0.5" />
                <p className="text-white font-bold uppercase tracking-wider text-xs">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border-2 border-green-500 flex items-start gap-2 brutalist-panel">
                <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                <p className="text-white font-bold uppercase tracking-wider text-xs">{success}</p>
              </div>
            )}

            {showRulesHint && (
              <div className="mb-4 p-3.5 bg-primary-800 border-2 border-accent/40 text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-accent font-black uppercase tracking-widest text-[11px] flex items-center gap-1">
                    <Info size={13} /> Firestore Database Rules:
                  </p>
                  <button
                    onClick={() => setShowRulesHint(false)}
                    className="text-white/50 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/70 font-bold uppercase tracking-wider text-[10px] mb-2">
                  Para sincronizar comentarios de visitantes globalmente, pega las reglas en Firebase Rules:
                </p>
                <pre className="bg-black border border-accent/40 p-2 text-[9px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                  {RULES_HINT}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(RULES_HINT);
                  }}
                  className="mt-2 px-3 py-1 bg-accent text-black text-[10px] border border-black font-black uppercase tracking-widest hover:bg-white transition-colors"
                >
                  📋 COPIAR REGLAS
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 font-black uppercase tracking-widest text-[11px] mb-1.5">
                  Tu Nombre / Apodo <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Sofia_Dance"
                    className="w-full bg-primary-800 border-2 border-white/20 text-white pl-10 pr-4 py-2.5 font-bold text-xs tracking-wider placeholder:text-white/30 focus:border-accent focus:outline-none brutalist-panel shadow-[4px_4px_0px_rgba(255,0,0,0.4)] focus:shadow-[4px_4px_0px_rgba(255,0,0,1)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-black uppercase tracking-widest text-[11px] mb-1.5">
                  Tipo de Mensaje
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-primary-800 border-2 border-white/20 text-white px-3 py-2.5 font-bold text-xs uppercase tracking-wider focus:border-accent focus:outline-none brutalist-panel shadow-[4px_4px_0px_rgba(255,0,0,0.4)] focus:shadow-[4px_4px_0px_rgba(255,0,0,1)] transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-black text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 font-black uppercase tracking-widest text-[11px] mb-1.5">
                  Comentario / Petición <span className="text-accent">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="¿Qué baile te gustaría que hagamos cover? O déjanos tu saludo..."
                  className="w-full bg-primary-800 border-2 border-white/20 text-white p-3 font-bold text-xs tracking-wider placeholder:text-white/30 focus:border-accent focus:outline-none brutalist-panel shadow-[4px_4px_0px_rgba(255,0,0,0.4)] focus:shadow-[4px_4px_0px_rgba(255,0,0,1)] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full py-3.5 bg-accent text-black font-black uppercase tracking-[0.2em] text-base overflow-hidden border-4 border-black hover:border-white disabled:opacity-50 shadow-[6px_6px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? (
                    'PUBLICANDO...'
                  ) : (
                    <>
                      ENVIAR COMENTARIO <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Floating Physics Canvas Right (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">

            {/* Top Bar Controls */}
            <div className="flex items-center justify-between border-b-2 border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Flame className="text-accent animate-bounce" size={20} />
                <h3 className="text-lg md:text-xl font-display font-black text-white uppercase tracking-wider">
                  Comentarios ({allComments.length})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {viewMode === 'floating' && (
                  <button
                    onClick={() => initializeFloatingCards(allComments)}
                    className="flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/20 hover:border-accent text-white/80 hover:text-white text-[11px] font-black uppercase tracking-wider transition-all"
                    title="Mezclar tarjetas flotantes"
                  >
                    <Shuffle size={13} /> MEZCLAR
                  </button>
                )}
                <button
                  onClick={() => setViewMode(viewMode === 'floating' ? 'grid' : 'floating')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-accent text-black border border-black font-black text-[11px] uppercase tracking-wider hover:bg-white transition-all shadow-[2px_2px_0px_#000]"
                >
                  {viewMode === 'floating' ? (
                    <>
                      <Grid size={13} /> VER LISTA
                    </>
                  ) : (
                    <>
                      <Move size={13} /> MODO FLOTANTE
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* View Mode: Physics Floating Canvas Arena */}
            {viewMode === 'floating' ? (
              <div
                ref={containerRef}
                className="relative w-full h-[520px] bg-primary-900 border-4 border-white/20 brutalist-panel overflow-hidden rounded-sm shadow-[10px_10px_0px_rgba(255,0,0,0.3)]"
              >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

                {floatingCards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/60 font-black uppercase tracking-widest text-xs md:text-sm space-y-3">
                    <MessageSquare size={36} className="text-accent animate-pulse" />
                    <p className="max-w-xs leading-relaxed text-white">
                      Aún no hay comentarios flotando.
                    </p>
                    <p className="text-[10px] text-accent font-black tracking-widest">
                      ¡Sé el primero en enviar un comentario en el formulario!
                    </p>
                  </div>
                ) : (
                  floatingCards.map((item, index) => (
                    <div
                      key={item.id || index}
                      onMouseEnter={() => {
                        hoveredIndexRef.current = index;
                      }}
                      onMouseLeave={() => {
                        hoveredIndexRef.current = null;
                      }}
                      onClick={() => handleCardClick(item)}
                      style={{
                        transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
                        width: `${item.width}px`,
                      }}
                      className="absolute top-0 left-0 cursor-pointer bg-primary-900 border-2 border-accent/80 hover:border-white p-3.5 brutalist-panel transition-shadow hover:shadow-[0_0_25px_rgba(255,0,0,0.8)] hover:z-50 select-none group"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-black text-white uppercase text-xs group-hover:text-accent transition-colors truncate max-w-[90px]">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {user && (
                            <button
                              onClick={(e) => handleDirectDelete(e, item.id)}
                              title="Eliminar comentario (Admin)"
                              className="p-0.5 text-white/40 hover:text-accent hover:scale-110 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                          <span className="px-1.5 py-0.5 bg-accent/20 border border-accent text-[8px] font-black uppercase text-accent truncate">
                            {item.category || 'Mensaje'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-[11px] font-bold uppercase line-clamp-2 leading-tight mb-2">
                        "{item.comment}"
                      </p>

                      <div className="flex items-center justify-between text-[9px] text-white/40 font-bold uppercase border-t border-white/10 pt-1">
                        <span>{formatDateShort(item.createdAt)}</span>
                        <span className="text-accent font-black group-hover:underline flex items-center gap-0.5">
                          ABRIR <Sparkles size={9} />
                        </span>
                      </div>
                    </div>
                  ))
                )}

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 border border-white/20 px-4 py-1 text-[10px] text-white/60 font-black uppercase tracking-widest pointer-events-none backdrop-blur-sm">

                </div>
              </div>
            ) : (
              /* View Mode: Classic Responsive Grid List */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
                {allComments.length === 0 ? (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center p-6 bg-primary-900 border-2 border-white/10 brutalist-panel">
                    <MessageSquare size={36} className="text-accent mb-3 animate-bounce" />
                    <p className="text-white font-black uppercase tracking-widest text-sm mb-1">
                      No hay comentarios publicados aún
                    </p>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
                      Usa el formulario a la izquierda para publicar tu primer mensaje.
                    </p>
                  </div>
                ) : (
                  allComments.map((item, index) => (
                  <div
                    key={item.id || index}
                    onClick={() => handleCardClick(item)}
                    className="group cursor-pointer bg-primary-900 border-2 border-white/20 hover:border-accent p-4 brutalist-panel transition-all hover:-translate-y-1 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-accent/20 border border-accent flex items-center justify-center font-black text-accent text-xs">
                            {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-black text-white uppercase text-xs group-hover:text-accent transition-colors truncate max-w-[120px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {user && (
                            <button
                              onClick={(e) => handleDirectDelete(e, item.id)}
                              title="Eliminar comentario (Admin)"
                              className="p-1 text-white/40 hover:text-accent hover:scale-110 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                          <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-[9px] font-black uppercase tracking-wider text-white/80 shrink-0">
                            {item.category || 'Mensaje'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-xs font-bold uppercase line-clamp-3 leading-relaxed mb-3">
                        "{item.comment}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/40 font-bold uppercase">
                      <span>{formatDateShort(item.createdAt)}</span>
                      <span className="text-accent group-hover:underline font-black flex items-center gap-1">
                        VER MÁS <Sparkles size={10} />
                      </span>
                    </div>
                  </div>
                )))}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
