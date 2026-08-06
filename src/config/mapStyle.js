/**
 * Fond de plan utilisé par toutes les cartes de l'admin.
 *
 * Défini au build via `REACT_APP_DEFAULT_MAP_STYLE` (voir `.env`) pour pouvoir
 * pointer vers un serveur de tuiles interne selon le déploiement. La valeur par
 * défaut est OpenFreeMap : aucune clé d'API, contrairement aux styles
 * `mapbox://` que maplibre ne sait de toute façon pas résoudre.
 */
export const DEFAULT_MAP_STYLE = process.env.REACT_APP_DEFAULT_MAP_STYLE
  || 'https://tiles.openfreemap.org/styles/liberty';

export default DEFAULT_MAP_STYLE;
