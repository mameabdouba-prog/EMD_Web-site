import { useEffect, useRef, useState } from 'react';

/**
 * Wrapper d'animation au scroll : révèle son contenu avec un fondu
 * + translation verticale lorsqu'il entre dans le viewport (IntersectionObserver).
 *
 * Props :
 * - delay    : décalage en ms (pour créer des effets de stagger)
 * - y        : distance de translation initiale en px
 * - once     : n'animer qu'une seule fois (défaut : true)
 */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const Reveal = ({
  children,
  delay = 0,
  y = 28,
  once = true,
  className = '',
  as: Tag = 'div',
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.8s ${EASE} ${delay}ms, transform 0.8s ${EASE} ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
