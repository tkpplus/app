import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Search, 
  Play, 
  ChevronRight, 
  Clock, 
  Trash2,
  Film,
  BookOpen,
  Tv
} from 'lucide-react';
import { videos, seriesData } from '../../data/seed';
import { parashotInfo, Parasha } from '../../data/parashot';
import { getSeriesCover } from '../../utils/covers';

// Normaliza texto eliminando acentos para búsquedas tolerantes
function normalize(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Resalta las palabras coincidentes sin emojis
function highlightText(text: string | null | undefined, highlight: string) {
  if (!text) return '';
  if (!highlight.trim()) return text;
  const escaped = highlight.trim().replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.toString().split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/30 text-primary font-bold rounded px-1 border border-primary/30">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

function formatVideoDuration(seconds: number | undefined): string {
  if (!seconds || seconds <= 0) return 'HD';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins} min`;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function cleanVideoTitle(rawTitle: string): string {
  return rawTitle
    .replace('Torah Kids Puppets | ', '')
    .replace(/Parash[aá] /, '')
    .replace(/Parashat /, '')
    .replace(/#\S+/g, '')
    .replace(/ - Parash[aá] en un minuto/i, '')
    .replace(/ פרשת.*/, '')
    .trim();
}

const RECENT_SEARCHES_KEY = 'tkp_recent_searches';

// Sugerencias idénticas al diseño de referencia del usuario (sin emojis)
const SUGGESTED_QUERIES = [
  'Bereshit',
  'Noaj',
  'Pesaj',
  'Janucá',
  'Shabat',
  'Cuentos',
  'Moshé',
  'David',
  'Shemot',
  'Purim'
];

export function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Transiciones de montaje/desmontaje suaves estilo Apple TV (elimina el "golpe seco")
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Control del ciclo de vida de la transición de entrada y salida
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setIsRendered(true);
      // Pequeño frame para permitir que el DOM monte antes de animar la opacidad y escala
      timer = setTimeout(() => {
        setIsVisible(true);
        searchInputRef.current?.focus();
      }, 20);
    } else {
      setIsVisible(false);
      timer = setTimeout(() => {
        setIsRendered(false);
      }, 280);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Cierre animado suave
  const handleSmoothClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 260);
  };

  // Cargar búsquedas recientes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    try {
      const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter(s => s !== termToRemove);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Bloquear scroll del body
  useEffect(() => {
    if (isRendered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRendered]);

  // Cerrar con tecla Escape de forma suave
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRendered) {
        handleSmoothClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRendered]);

  // 1. Series coincidentes
  const matchedSeries = useMemo(() => {
    const q = normalize(searchTerm);
    if (!q) return [];
    return seriesData
      .map(s => {
        let score = 0;
        const normTitle = normalize(s.title);
        const normDesc = normalize(s.description);
        const normCat = normalize(s.categoryId);

        if (normTitle === q) score += 35;
        else if (normTitle.startsWith(q)) score += 22;
        else if (normTitle.includes(q)) score += 15;
        else if (normCat.includes(q)) score += 8;
        else if (normDesc.includes(q)) score += 4;

        return { series: s, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.series);
  }, [searchTerm]);

  // 2. Episodios coincidentes
  const matchedVideos = useMemo(() => {
    const q = normalize(searchTerm);
    if (!q) return [];

    return videos
      .map(video => {
        let score = 0;
        const cleanTitle = cleanVideoTitle(video.title);
        const normTitle = normalize(cleanTitle);
        const normCat = normalize(video.category);
        const normSub = normalize(video.subcategory);
        const normDesc = normalize(video.description);
        const normSeries = normalize(video.seriesId);
        const normSecondary = normalize((video as any).secondarySeriesIds?.join(' '));
        const normFestivity = normalize((video as any).relatedFestivity);

        if (normTitle === q) score += 30;
        else if (normTitle.startsWith(q)) score += 20;
        else if (normTitle.includes(q)) score += 14;

        if (normSeries.includes(q) || normSecondary.includes(q)) score += 8;
        if (normFestivity.includes(q)) score += 6;
        if (normSub.includes(q)) score += 4;
        if (normCat.includes(q)) score += 3;
        if (normDesc.includes(q)) score += 2;

        return { video, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.video);
  }, [searchTerm]);

  // 3. Parashot coincidentes
  const matchedParashot = useMemo(() => {
    const q = normalize(searchTerm);
    if (!q) return [];
    return parashotInfo.filter(p => {
      const inName = normalize(p.name).includes(q);
      const inBook = normalize(p.book).includes(q);
      const inSummary = normalize(p.summary).includes(q);
      const inNum = `parasha ${p.num}`.includes(q) || `#${p.num}`.includes(q);
      return inName || inBook || inSummary || inNum;
    });
  }, [searchTerm]);

  const totalResults = matchedSeries.length + matchedVideos.length + matchedParashot.length;

  if (!isRendered) return null;

  const handleSelectQuery = (query: string) => {
    setSearchTerm(query);
    saveRecentSearch(query);
  };

  const handlePlayVideo = (id: string) => {
    saveRecentSearch(searchTerm);
    handleSmoothClose();
    navigate(`/watch/${id}`);
  };

  const handleNavigateSeries = (seriesId: string) => {
    saveRecentSearch(searchTerm);
    handleSmoothClose();
    navigate(`/series/${seriesId}`);
  };

  const handleNavigateParasha = (parasha: Parasha) => {
    saveRecentSearch(searchTerm);
    handleSmoothClose();
    if (parasha.bookSlug) {
      navigate(`/series/${parasha.bookSlug}`);
    } else {
      navigate(`/parashot/${parasha.num}`);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center pt-8 md:pt-14 px-4 sm:px-6 md:px-10 overflow-y-auto custom-scrollbar transition-all duration-300 ease-out ${
        isVisible 
          ? 'bg-[#0a0b0e]/95 backdrop-blur-2xl opacity-100' 
          : 'bg-[#0a0b0e]/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        // Cerrar si hace click en el fondo exterior
        if (e.target === e.currentTarget) {
          handleSmoothClose();
        }
      }}
    >
      {/* Botón Cerrar (Discreto y Elegante con micro-interacción) */}
      <button
        onClick={handleSmoothClose}
        className={`fixed top-5 right-5 md:top-8 md:right-8 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
        title="Cerrar (Esc)"
        aria-label="Cerrar búsqueda"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Contenedor principal con transición Apple TV (escala y traslación sutil) */}
      <div 
        className={`w-full max-w-6xl flex flex-col items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-[0.98]'
        }`}
      >
        {/* ENCABEZADO Y CAMPO DE BÚSQUEDA MINIMALISTA */}
        <div className="w-full max-w-4xl relative text-center mb-8">
          <div className="relative flex items-center justify-center">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="¿Qué quieres ver hoy?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  saveRecentSearch(searchTerm);
                }
              }}
              className="w-full bg-transparent text-center text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white placeholder-[#7b899c] focus:outline-none py-2 transition-all tracking-tight"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90"
                title="Borrar texto"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Línea horizontal divisoria sutil con gradiente */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mt-5 md:mt-7 transition-opacity" />
        </div>

        {/* CONTENIDO PRINCIPAL: ENFOCADO EXCLUSIVAMENTE EN SERIES, EPISODIOS Y PARASHOT */}
        <div className="w-full pb-24 transition-opacity duration-300">
          {searchTerm.trim() ? (
            /* VISTA DE RESULTADOS */
            totalResults === 0 ? (
              <div className="text-center py-20 space-y-4 animate-in fade-in duration-300">
                <p className="text-base sm:text-lg text-white/60 font-medium">
                  No encontramos resultados para "{searchTerm}"
                </p>
                <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                  Prueba buscando por el nombre de una serie (Bereshit, Shemot), una festividad (Pesaj) o una historia.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUERIES.slice(0, 5).map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleSelectQuery(tag)}
                      className="px-4 py-2 rounded-full bg-[#1c1c20] hover:bg-[#28282e] border border-white/5 hover:border-white/20 text-white/80 text-xs font-medium transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-12 transition-all duration-300 ease-out">
                {/* 1. SECCIÓN EXCLUSIVA: SERIES */}
                {matchedSeries.length > 0 && (
                  <section className="transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-primary" />
                        <h3 className="text-lg md:text-xl font-bold font-display text-white">
                          Series
                        </h3>
                        <span className="text-xs font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                          {matchedSeries.length}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
                      {matchedSeries.map(series => {
                        const epCount = videos.filter(v => v.seriesId === series.id).length;
                        return (
                          <div
                            key={series.id}
                            onClick={() => handleNavigateSeries(series.id)}
                            className="group relative flex aspect-[2/3] w-full flex-col justify-end overflow-hidden rounded-2xl bg-surface border border-white/10 transition-all duration-300 ease-out hover:scale-105 hover:border-white/30 hover:shadow-2xl cursor-pointer shadow-lg shadow-black/50"
                          >
                            <img
                              src={getSeriesCover(series.id, series.thumbnail)}
                              alt={series.title}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent transition-opacity group-hover:via-black/20" />

                            <div className="relative z-10 p-3 flex flex-col justify-end text-white">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-primary mb-0.5">
                                {series.categoryId || 'Serie'}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold font-display line-clamp-1 mb-1">
                                {highlightText(series.title, searchTerm)}
                              </h4>
                              <div className="flex items-center justify-between text-[10px] text-white/60 pt-1 border-t border-white/10">
                                <span>{epCount} eps</span>
                                <span className="text-primary font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                                  Ver <ChevronRight className="w-3 h-3 ml-0.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 2. SECCIÓN EXCLUSIVA: EPISODIOS */}
                {matchedVideos.length > 0 && (
                  <section className="transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-primary" />
                        <h3 className="text-lg md:text-xl font-bold font-display text-white">
                          Episodios
                        </h3>
                        <span className="text-xs font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                          {matchedVideos.length}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {matchedVideos.map(video => {
                        return (
                          <div
                            key={video.id}
                            onClick={() => handlePlayVideo(video.id)}
                            className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.03] hover:shadow-2xl bg-[#181920] border border-white/10 hover:border-white/30 flex flex-col justify-end shadow-md"
                          >
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                            {/* Duración */}
                            <div className="absolute top-2 right-2 bg-black/85 backdrop-blur-xs rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                              {formatVideoDuration(video.duration)}
                            </div>

                            {/* Play overlay en hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35">
                              <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-200">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </div>
                            </div>

                            {/* Info inferior */}
                            <div className="relative z-10 w-full p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-0.5">
                                {video.category || 'Episodio'}
                                {video.seriesId ? ` • ${video.seriesId.replace(/-/g, ' ')}` : ''}
                              </span>
                              <h4 className="font-bold text-xs sm:text-sm text-white leading-snug line-clamp-2">
                                {highlightText(cleanVideoTitle(video.title), searchTerm)}
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 3. SECCIÓN EXCLUSIVA: PARASHOT DE LA TORÁ */}
                {matchedParashot.length > 0 && (
                  <section className="transition-all duration-300">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <h3 className="text-lg md:text-xl font-bold font-display text-white">
                          Parashot
                        </h3>
                        <span className="text-xs font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                          {matchedParashot.length}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {matchedParashot.map(parasha => (
                        <div
                          key={parasha.num}
                          onClick={() => handleNavigateParasha(parasha)}
                          className="group bg-[#181920] hover:bg-[#20222c] border border-white/5 hover:border-white/20 rounded-xl p-4 transition-all duration-200 ease-out hover:scale-[1.01] cursor-pointer flex flex-col justify-between shadow"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded-md bg-white/10 text-primary text-[10px] font-bold">
                                Parashá #{parasha.num}
                              </span>
                              <span className="text-[11px] text-white/50 font-medium">
                                Libro: {parasha.book}
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold font-display text-white group-hover:text-primary transition-colors mb-1">
                              {highlightText(parasha.name, searchTerm)}
                            </h4>

                            {parasha.summary && (
                              <p className="text-xs text-white/60 line-clamp-2 font-light">
                                {highlightText(parasha.summary, searchTerm)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-xs text-primary font-semibold">
                            <span>Ver en {parasha.book}</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )
          ) : (
            /* ESTADO INICIAL (SUGERENCIAS Y BÚSQUEDAS RECIENTES) */
            <div className="space-y-8 pt-2 transition-all duration-300 ease-out">
              {/* Búsquedas recientes si existen */}
              {recentSearches.length > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="text-xs uppercase tracking-widest font-semibold text-white/40 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Búsquedas recientes
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-white/40 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      title="Borrar historial"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Borrar</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2.5">
                    {recentSearches.map(term => (
                      <div
                        key={term}
                        onClick={() => handleSelectQuery(term)}
                        className="group flex items-center gap-2 px-4 py-2 bg-[#1c1c20] hover:bg-[#28282e] border border-white/5 hover:border-white/20 rounded-full text-white/80 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-white/30 hover:text-white/80 p-0.5 rounded transition-colors cursor-pointer"
                          title="Quitar"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BÚSQUEDAS SUGERIDAS (TAL CUAL LA IMAGEN ADJUNTA) */}
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest font-semibold text-white/40 mb-4">
                  BÚSQUEDAS SUGERIDAS
                </p>

                <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                  {SUGGESTED_QUERIES.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleSelectQuery(tag)}
                      className="px-5 py-2.5 rounded-full bg-[#1c1c20] hover:bg-[#28282e] border border-white/5 hover:border-white/20 text-white/85 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
