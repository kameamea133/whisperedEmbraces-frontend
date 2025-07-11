import ReactGA from 'react-ga4';

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const isProduction = import.meta.env.PROD;

// Vérifier le consentement cookies
const hasConsent = () => {
  return localStorage.getItem('ga-consent') === 'true';
};

// Vérifier si GA est activé
export const isGAEnabled = () => {
  return GA4_MEASUREMENT_ID && isProduction && hasConsent();
};

// Track page view
export const trackPageView = (path, title) => {
  if (isGAEnabled()) {
    ReactGA.send({ 
      hitType: "pageview", 
      page: path,
      title: title 
    });
  }
};

// Track events
export const trackEvent = (category, action, label, value) => {
  if (isGAEnabled()) {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
  }
};

// Track article interactions
export const trackArticleInteraction = (action, articleTitle) => {
  trackEvent('Article', action, articleTitle);
};

export default {
  isGAEnabled,
  trackPageView,
  trackEvent,
  trackArticleInteraction
}; 