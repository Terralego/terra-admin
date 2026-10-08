import React from 'react';
import { useField } from 'react-final-form';

/**
 * Remonte l'aperçu des données du formulaire vers l'aside de la vue.
 *
 * L'aside est un frère du formulaire dans react-admin, pas un enfant : il n'a
 * pas accès au formulaire. Les champs qui calculent l'aperçu (fichier, CSV,
 * PostGIS) le publient dans ce contexte, que la vue fournit et passe à l'aside.
 */
const PreviewContext = React.createContext(() => {});

/**
 * Côté vue : état de l'aperçu publié, et son affichage. Pas d'aperçu publié
 * (source WMTS, type pas encore choisi) : pas d'aside ni d'interrupteur.
 */
export const usePreviewAside = () => {
  const [preview, setPreview] = React.useState(null);

  // Ouvert par défaut : l'aperçu sert justement à vérifier le fichier choisi
  const [open, setOpen] = React.useState(true);
  const toggle = React.useCallback(() => setOpen(previous => !previous), []);

  return {
    preview,
    publish: setPreview,
    open,
    toggle,
    available: Boolean(preview),
  };
};

export const PreviewProvider = PreviewContext.Provider;

/**
 * Côté formulaire : publie l'aperçu calculé par `useFilePreview` ou
 * `useSqlPreview`, avec ce que l'aside doit savoir du formulaire.
 */
export const PreviewPublisher = ({ preview, loading, error, bbox, isEditMode }) => {
  const publish = React.useContext(PreviewContext);
  const { input: { value: file } } = useField('file');
  const { input: { value: layerName } } = useField('layer_name');

  const rawFile = file?.rawFile;

  React.useEffect(() => {
    publish({
      preview,
      loading,
      error,
      bbox,
      isEditMode,
      layerName,
      hasFile:  Boolean(rawFile),
      fileName: rawFile?.name,
      fileSize: rawFile?.size,
    });
  }, [publish, preview, loading, error, bbox, isEditMode, layerName, rawFile]);

  // Le type de source a changé, ou on a quitté le formulaire
  React.useEffect(() => () => publish(null), [publish]);

  return null;
};

export default usePreviewAside;
