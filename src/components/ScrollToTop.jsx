import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Remonter en haut de page
    window.scrollTo(0, 0);

    // Envoyer la page vue à Google Analytics
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

export default ScrollToTop;
