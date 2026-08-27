import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from 'lucide-react';

const ZOOM = 2;

/**
 * Lightbox premium pour la galerie :
 * - Navigation flèches / clavier / swipe mobile
 * - Zoom au clic avec déplacement (pan) à la souris
 * - Compteur, miniatures cliquables, préchargement des voisines
 */
const Lightbox = ({ images, index, onClose, onNavigate }) => {
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const thumbsRef = useRef(null);
  const pointer = useRef({ down: false, startX: 0, startY: 0, lastX: 0, lastY: 0, moved: false });

  const total = images.length;
  const image = images[index];
  const hasMultiple = total > 1;

  const goPrev = useCallback(() => {
    if (hasMultiple) onNavigate((index - 1 + total) % total);
  }, [index, total, hasMultiple, onNavigate]);

  const goNext = useCallback(() => {
    if (hasMultiple) onNavigate((index + 1) % total);
  }, [index, total, hasMultiple, onNavigate]);

  /* Réinitialisation + préchargement des images voisines à chaque navigation */
  useEffect(() => {
    setLoaded(false);
    setZoomed(false);
    setPos({ x: 0, y: 0 });
    if (hasMultiple) {
      [(index + 1) % total, (index - 1 + total) % total].forEach((i) => {
        const im = new Image();
        im.src = images[i]?.image;
      });
    }
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Raccourcis clavier : Échap = fermer, flèches = naviguer */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, onClose]);

  /* Fait défiler la miniature active dans la zone visible */
  useEffect(() => {
    thumbsRef.current?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [index]);

  if (!image) return null;

  const clampPan = (x, y) => {
    const el = wrapRef.current;
    const img = imgRef.current;
    if (!el || !img) return { x, y };
    const maxX = Math.max(0, (img.clientWidth * ZOOM - el.clientWidth) / 2);
    const maxY = Math.max(0, (img.clientHeight * ZOOM - el.clientHeight) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const onPointerDown = (e) => {
    pointer.current = { down: true, startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const p = pointer.current;
    if (!p.down) return;
    const dx = e.clientX - p.lastX;
    const dy = e.clientY - p.lastY;
    p.lastX = e.clientX;
    p.lastY = e.clientY;
    if (Math.abs(e.clientX - p.startX) > 6 || Math.abs(e.clientY - p.startY) > 6) p.moved = true;
    if (zoomed) setPos((prev) => clampPan(prev.x + dx, prev.y + dy));
  };

  const onPointerUp = (e) => {
    const p = pointer.current;
    if (!p.down) return;
    p.down = false;
    if (!zoomed) {
      const dx = e.clientX - p.startX;
      if (!p.moved) setZoomed(true);           // simple clic -> zoom
      else if (dx < -60) goNext();             // swipe gauche -> suivante
      else if (dx > 60) goPrev();              // swipe droite -> précédente
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-fade-in select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
    >
      {/* ===== Barre supérieure : compteur + fermer ===== */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs sm:text-sm font-bold tabular-nums bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 backdrop-blur-sm">
          {index + 1} <span className="text-white/50">/</span> {total}
        </span>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="w-11 h-11 rounded-full bg-white/10 border border-white/15 hover:bg-orange-500 hover:border-orange-500 hover:rotate-90 flex items-center justify-center transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ===== Zone image ===== */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 sm:px-24" onClick={(e) => e.stopPropagation()}>
        {hasMultiple && (
          <>
            <button
              onClick={goPrev}
              aria-label="Image précédente"
              className="absolute left-2 sm:left-4 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/15 hover:bg-orange-500 hover:border-orange-500 text-white flex items-center justify-center backdrop-blur-sm hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goNext}
              aria-label="Image suivante"
              className="absolute right-2 sm:right-4 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/15 hover:bg-orange-500 hover:border-orange-500 text-white flex items-center justify-center backdrop-blur-sm hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div ref={wrapRef} className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
            </div>
          )}
          <img
            ref={imgRef}
            src={image.image}
            alt={image.title || ''}
            draggable="false"
            onLoad={() => setLoaded(true)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: loaded ? 1 : 0,
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoomed ? ZOOM : 1})`,
            }}
            className={`max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-zoom-in transition-[transform,opacity] duration-300 ease-out ${
              zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}
          />
        </div>

        {/* Indication zoom */}
        {!zoomed && loaded && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-white/70 text-xs backdrop-blur-sm pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5" />
            Cliquez pour zoomer
          </div>
        )}
      </div>

      {/* ===== Légende ===== */}
      <div className="text-center px-4 pt-4 pb-1 shrink-0 max-w-3xl mx-auto w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">{image.title}</h3>
        {image.cycle_display && (
          <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[11px] font-bold uppercase tracking-wider">
            {image.cycle_display}
          </span>
        )}
        {image.description && (
          <p className="text-slate-400 text-sm mt-2 line-clamp-2">{image.description}</p>
        )}
      </div>

      {/* ===== Miniatures ===== */}
      {hasMultiple && (
        <div
          ref={thumbsRef}
          className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-4 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              data-active={i === index}
              onClick={() => onNavigate(i)}
              aria-label={`Voir ${img.title}`}
              className={`relative h-14 w-20 shrink-0 rounded-lg overflow-hidden ring-2 transition-all duration-200 ${
                i === index
                  ? 'ring-orange-400 opacity-100 scale-105'
                  : 'ring-white/15 opacity-45 hover:opacity-85 hover:ring-white/40'
              }`}
            >
              <img src={img.image} alt="" loading="lazy" className="w-full h-full object-cover" draggable="false" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
