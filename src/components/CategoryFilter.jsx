import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Filter, Sparkles } from 'lucide-react';

/**
 * Mappage d'icônes par défaut
 */
const DEFAULT_ICONS = {
    all: null,
};

const getIcon = (category) =>
    category.icon || DEFAULT_ICONS[category.value] || Sparkles;

/**
 * Composant de filtre par catégorie moderne : capsule glassmorphism flottante,
 * pilule active glissante animée (segmented control), compteurs intégrés
 * et défilement horizontal fluide sur mobile.
 */
const CategoryFilter = ({
    categories = [],
    selectedCategory = 'all',
    onSelectCategory,
    counts = {},
    totalCount = null,
    label = "Catégories"
}) => {
    const listRef = useRef(null);
    const itemRefs = useRef({});
    const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false });

    /* Positionne la pilule active sous l'onglet sélectionné */
    const updateIndicator = useCallback(() => {
        const el = itemRefs.current[selectedCategory];
        const list = listRef.current;
        if (!el || !list) return;
        setIndicator({
            x: el.offsetLeft,
            width: el.offsetWidth,
            ready: true,
        });
    }, [selectedCategory]);

    useEffect(() => {
        updateIndicator();
        /* Recalcule après chargement des polices (largeurs variables) */
        if (document?.fonts?.ready) {
            document.fonts.ready.then(updateIndicator);
        }
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator]);

    return (
        <section className="sticky top-20 z-40 py-3 pointer-events-none">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pointer-events-auto">

                {/* Capsule flottante en verre */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 ring-1 ring-slate-900/5 shadow-lg shadow-slate-900/[0.08] rounded-full p-1.5 flex items-center gap-2 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/10">

                    {/* Label desktop */}
                    <div className="hidden lg:flex items-center gap-2 pl-4 pr-3 py-2 flex-shrink-0 text-slate-400 font-bold text-[11px] tracking-[0.15em] uppercase">
                        <Filter className="w-3.5 h-3.5" />
                        <span>{label}</span>
                    </div>

                    {/* Séparateur */}
                    <div className="hidden lg:block w-px h-5 bg-slate-900/10 flex-shrink-0" />

                    {/* Piste des onglets */}
                    <div
                        ref={listRef}
                        role="tablist"
                        aria-label={label}
                        className="relative flex items-center w-full overflow-x-auto no-scrollbar snap-x"
                    >
                        {/* Pilule active glissante */}
                        <span
                            aria-hidden="true"
                            className={`absolute top-0 left-0 h-full rounded-full bg-slate-900 shadow-md shadow-slate-900/25 will-change-transform ${indicator.ready
                                    ? 'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
                                    : 'transition-none'
                                }`}
                            style={{
                                transform: `translateX(${indicator.x}px)`,
                                width: `${indicator.width}px`,
                            }}
                        />

                        {categories.map((category) => {
                            const isSelected = selectedCategory === category.value;
                            const IconComponent = getIcon(category);
                            const itemCount = category.value === 'all'
                                ? (totalCount !== null ? totalCount : counts[category.value])
                                : counts[category.value];

                            return (
                                <button
                                    key={category.value}
                                    ref={(el) => (itemRefs.current[category.value] = el)}
                                    role="tab"
                                    aria-selected={isSelected}
                                    onClick={() => onSelectCategory && onSelectCategory(category.value)}
                                    className={`group relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-tight whitespace-nowrap flex-shrink-0 select-none outline-none snap-start transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${isSelected
                                            ? 'text-white'
                                            : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {IconComponent && (
                                        <IconComponent
                                            className={`w-3.5 h-3.5 transition-all duration-300 ${isSelected
                                                    ? 'text-orange-400 scale-110'
                                                    : 'group-hover:text-orange-500 group-hover:-rotate-12 group-hover:scale-110'
                                                }`}
                                        />
                                    )}

                                    <span>{category.label}</span>

                                    {itemCount !== undefined && itemCount !== null && (
                                        <span
                                            className={`min-w-[20px] px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none transition-colors duration-200 ${isSelected
                                                    ? 'bg-white/15 text-orange-300'
                                                    : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600'
                                                }`}
                                        >
                                            {itemCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryFilter;
