import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image = "/logo12.png", 
  url, 
  type = "website",
  author = "Étreintes Éphémères"
}) => {
  const defaultTitle = "Étreintes Éphémères - Partage de Poésie et Textes Littéraires";
  const defaultDescription = "Découvrez et partagez des poèmes, textes et étreintes littéraires. Une communauté dédiée à l'expression poétique et à l'art des mots.";
  const defaultKeywords = "poésie, textes, littérature, étreintes, partage, communauté, écriture, poèmes, inspiration";
  
  const fullTitle = title ? `${title} | Étreintes Éphémères` : defaultTitle;
  const fullUrl = url ? `https://etreintes-ephemeres.com${url}` : "https://etreintes-ephemeres.com";
  const fullImage = image.startsWith('http') ? image : `https://etreintes-ephemeres.com${image}`;
  
  return (
    <Helmet>
      {/* Métadonnées de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="Étreintes Éphémères" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@etreintes_ephemeres" />
      
      {/* Autres métadonnées utiles */}
      <meta name="theme-color" content="#C8C4B9" />
      <meta name="msapplication-TileColor" content="#C8C4B9" />
    </Helmet>
  );
};

export default SEOHead; 