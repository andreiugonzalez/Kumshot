import { useState, useEffect } from 'react';
import { ExternalLink, Plus, Pencil, Trash2, Loader2, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import AddLinkModal from './AddLinkModal';
import EditLinkModal from './EditLinkModal';
import DeleteLinkModal from './DeleteLinkModal';
import { useAuth } from '../context/AuthContext';
import { getLinks } from '../services/linksService';

const FALLBACK_LINKS = [
  { id: 'fallback-1', title: "Presentacion kumshot - 4SHO 4SHO - YEAH YEAH - THE PURGE | WINTER STAGE", url: "https://www.youtube.com/watch?v=j4HfNPyl5F4" },
  { id: 'fallback-2', title: "Presentacion kumshot - 4SHO 4SHO -YEAH YEAH - THE PURGE | koreanity", url: "https://www.youtube.com/watch?v=kf-4yQV3gIk" },
];

const FIRESTORE_RULES_HINT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /presentation_links/{link} {
      allow read: if true;
      allow write, delete, update, create: if request.auth != null;
    }
  }
}`;

export default function LinksSection() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [showRulesHint, setShowRulesHint] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const { user } = useAuth();

  const loadLinks = async (silent = false) => {
    if (!silent) setLoading(true);
    setGlobalError('');

    const result = await getLinks();
    if (result.success && result.links.length > 0) {
      setLinks(result.links);
      setIsUsingFallback(false);
    } else if (result.success && result.links.length === 0) {
      setLinks([]);
      setIsUsingFallback(false);
      if (result.error) {
        setGlobalError(result.error);
        setIsUsingFallback(true);
        setLinks(FALLBACK_LINKS);
      }
    } else {
      setLinks(FALLBACK_LINKS);
      setIsUsingFallback(true);
      if (user) {
        setGlobalError(
          result.error ||
          'No se pudo conectar con la base de datos. Revisa reglas Firestore o conexión.'
        );
      }
    }
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleDeleted = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setGlobalSuccess('Presentación eliminada correctamente.');
    setTimeout(() => setGlobalSuccess(''), 3000);
  };

  const handleAddSuccess = () => {
    loadLinks(true);
    setGlobalSuccess('Presentación agregada correctamente.');
    setTimeout(() => setGlobalSuccess(''), 3000);
  };

  const handleUpdateSuccess = () => {
    loadLinks(true);
    setGlobalSuccess('Presentación actualizada correctamente.');
    setTimeout(() => setGlobalSuccess(''), 3000);
  };

  const openEdit = (link) => {
    setSelectedLink(link);
    setEditModalOpen(true);
  };

  const openDelete = (link) => {
    setSelectedLink(link);
    setDeleteModalOpen(true);
  };

  const padNumber = (n) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <section id="links" className="py-32 px-6 md:px-12 lg:px-24 border-b-2 border-white/10 bg-black relative overflow-hidden">
      <AddLinkModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={handleAddSuccess}
      />
      <EditLinkModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedLink(null);
        }}
        link={selectedLink}
        onUpdated={handleUpdateSuccess}
      />
      <DeleteLinkModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedLink(null);
        }}
        link={selectedLink}
        onDeleted={handleDeleted}
      />
      
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

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="flex flex-col items-center justify-center mb-10 md:mb-16 text-center">
          <div className="flex items-center gap-4 mb-6 flex-wrap justify-center">
            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase leading-none">
              Presentaciones
            </h2>
            {user && (
              <button
                onClick={() => setAddModalOpen(true)}
                className="group flex items-center gap-2 px-5 py-3 bg-accent text-black font-black uppercase tracking-widest text-sm border-4 border-black hover:border-white transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
              >
                <Plus size={18} />
                NUEVA
              </button>
            )}
          </div>
          <div className="w-24 h-2 bg-accent mb-4"></div>
          {user && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <p className="text-accent/80 font-black uppercase tracking-widest text-xs">
                MODO ADMIN ACTIVO • EDITAR / ELIMINAR DISPONIBLES
              </p>
              <button
                onClick={() => loadLinks()}
                className="flex items-center gap-2 px-3 py-1 text-xs border-2 border-white/20 text-white/70 hover:text-white hover:border-white/60 uppercase font-black tracking-widest transition-all"
                title="Volver a cargar desde Firestore"
              >
                <RefreshCw size={14} /> Recargar
              </button>
            </div>
          )}
        </div>

        {globalSuccess && (
          <div className="mb-8 p-4 border-4 border-green-500 bg-green-500/15 flex items-start gap-3 shadow-[6px_6px_0px_rgba(34,197,94,0.25)]">
            <CheckCircle size={22} className="text-green-400 shrink-0 mt-0.5" />
            <p className="text-white font-bold uppercase tracking-wider text-sm">
              {globalSuccess}
            </p>
          </div>
        )}

        {globalError && user && (
          <div className="mb-8 p-4 md:p-5 border-4 border-accent bg-accent/15 shadow-[8px_8px_0px_rgba(255,0,0,0.25)]">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle size={24} className="text-accent shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-accent font-black uppercase tracking-wider text-sm mb-1">
                  ERROR EN LA BASE DE DATOS
                </p>
                <p className="text-white/90 font-bold uppercase tracking-wider text-xs md:text-sm">
                  {globalError}
                </p>
              </div>
              <button
                onClick={() => setShowRulesHint((v) => !v)}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 transition-colors text-xs font-black uppercase tracking-widest"
              >
                <Info size={14} /> {showRulesHint ? 'OCULTAR' : 'VER SOLUCIÓN'}
              </button>
            </div>
            {showRulesHint && (
              <div className="mt-4 bg-primary-800 border-2 border-white/15 p-4 text-left">
                <p className="text-accent font-black uppercase tracking-widest text-xs mb-2">
                  Paso 1 - Habilita Email/Password Auth:
                </p>
                <p className="text-white/80 font-bold uppercase tracking-wider text-xs mb-4">
                  Firebase Console → Authentication → Sign-in method → Add provider → Email/Password → Enable
                </p>
                <p className="text-accent font-black uppercase tracking-widest text-xs mb-2">
                  Paso 2 - Pega estas REGLAS en Firestore Database → Rules:
                </p>
                <pre className="bg-black border-2 border-accent/40 p-3 text-[10px] md:text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
{FIRESTORE_RULES_HINT}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(FIRESTORE_RULES_HINT);
                    setGlobalSuccess('¡Reglas copiadas! Pégalas en Firebase Rules.');
                    setTimeout(() => setGlobalSuccess(''), 3500);
                  }}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-accent text-black border-2 border-black font-black uppercase tracking-widest text-xs hover:bg-accent-light transition-colors"
                >
                  📋 COPIAR
                </button>
              </div>
            )}
          </div>
        )}

        {isUsingFallback && user && (
          <div className="mb-6 p-3 border-2 border-yellow-500/60 bg-yellow-500/10 flex items-start gap-3">
            <Info size={20} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-yellow-300/90 font-bold uppercase tracking-wider text-xs">
              MODO FUERA DE LÍNEA: Se muestran enlaces predeterminados. Cuando arregles las reglas, podrás guardar los tuyos en la nube.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={48} className="text-accent animate-spin" />
            <p className="text-white/50 font-black uppercase tracking-widest">Cargando presentaciones...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {links.length === 0 ? (
              <div className="p-12 text-center bg-primary-800 border-2 border-white/20 brutalist-panel">
                <p className="text-white/50 font-black uppercase tracking-widest text-lg mb-2">
                  NO HAY PRESENTACIONES CARGADAS
                </p>
                {user && (
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-black uppercase tracking-widest text-sm border-4 border-black hover:border-white transition-all hover:-translate-y-0.5 shadow-[6px_6px_0px_rgba(255,255,255,0.2)]"
                  >
                    <Plus size={18} /> AGREGAR LA PRIMERA
                  </button>
                )}
              </div>
            ) : (
              links.map((link, index) => (
                <div
                  key={link.id}
                  className="group relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-5 md:p-6 bg-primary-800 border-2 border-white/20 hover:border-accent brutalist-panel transition-all"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <span className="text-accent font-black text-2xl md:text-3xl shrink-0">{padNumber(index + 1)}</span>
                      <h3 className="text-lg md:text-2xl font-bold text-white uppercase tracking-wider group-hover:text-accent transition-colors break-words text-left">
                        {link.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors uppercase font-black tracking-widest text-xs sm:text-sm shrink-0 sm:ml-6 w-full sm:w-auto justify-between sm:justify-end">
                      VER AHORA <ExternalLink size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>

                  {user && (
                    <div className="flex items-center gap-2 border-t-2 border-white/10 pt-4 lg:pt-0 lg:border-t-0 lg:border-l-2 lg:pl-4 shrink-0 w-full lg:w-auto justify-between sm:justify-end">
                      <button
                        onClick={() => openEdit(link)}
                        title="Editar presentación"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border-2 border-white/20 text-white hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-black uppercase tracking-widest text-xs brutalist-panel"
                      >
                        <Pencil size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => openDelete(link)}
                        title="Eliminar presentación"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border-2 border-white/20 text-white hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-black uppercase tracking-widest text-xs brutalist-panel"
                      >
                        <Trash2 size={16} />
                        <span>Borrar</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
