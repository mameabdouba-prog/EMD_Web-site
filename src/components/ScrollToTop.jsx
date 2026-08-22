import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Remonter en haut de page instantanément (pas d'animation au changement de page)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Envoyer la page vue à Google Analytics
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

export default ScrollToTop;
