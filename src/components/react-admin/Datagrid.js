import React from 'react';
import {
  Datagrid as RaDatagrid,
  DatagridBody,
  DatagridRow,
  linkToRecord,
} from 'react-admin';
import { useHistory } from 'react-router-dom';

/**
 * Chemin qu'ouvrirait un clic sur la ligne, ou `null` s'il n'y a pas de
 * navigation à faire.
 *
 * Un `rowClick` fonction est volontairement ignoré : react-admin l'attend
 * (il peut être asynchrone), et attendre sa résolution ferait perdre le geste
 * utilisateur — le navigateur bloquerait alors l'ouverture de l'onglet. Ces
 * lignes gardent simplement le comportement d'origine.
 */
export const getRowPath = (rowClick, basePath, resource, id) => {
  const root = basePath || `/${resource}`;

  if (rowClick === 'edit') {
    return linkToRecord(root, id);
  }
  if (rowClick === 'show') {
    return linkToRecord(root, id, 'show');
  }
  // 'expand' et 'toggleSelection' n'ouvrent aucune page
  if (typeof rowClick === 'string' && !['expand', 'toggleSelection'].includes(rowClick)) {
    return rowClick;
  }
  return null;
};

/**
 * Ligne de tableau qui honore Ctrl/Cmd+clic et le clic molette.
 *
 * `DatagridRow` pose un `onClick` sur son `<TableRow>` et navigue par
 * `history.push`, sans jamais rendre de `<a href>` ni regarder les touches de
 * modification : Ctrl+clic navigue donc dans l'onglet courant, et le clic
 * molette ne fait rien.
 *
 * On n'écrase pas son `onClick` — ce qui obligerait à réimplémenter toute sa
 * logique — mais on intercepte en **phase de capture**. React interrompt toute
 * la liste des écouteurs d'un événement dès qu'on appelle `stopPropagation`,
 * y compris ceux portés par le même élément : le `onClick` de `DatagridRow` ne
 * s'exécute donc pas quand on a déjà ouvert un onglet.
 */
export const NewTabAwareRow = ({ basePath, resource, rowClick, id, ...props }) => {
  const history = useHistory();

  const openInNewTab = React.useCallback(event => {
    const path = getRowPath(rowClick, basePath, resource, id);
    if (!path) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    // `createHref` applique le basename du routeur (cf. BrowserRouter dans App)
    window.open(
      history.createHref({ pathname: path }),
      '_blank',
      'noopener,noreferrer',
    );
  }, [history, rowClick, basePath, resource, id]);

  const handleClickCapture = React.useCallback(event => {
    if (event.ctrlKey || event.metaKey) {
      openInNewTab(event);
    }
  }, [openInNewTab]);

  const handleAuxClick = React.useCallback(event => {
    if (event.button === 1) {
      openInNewTab(event);
    }
  }, [openInNewTab]);

  return (
    <DatagridRow
      {...props}
      id={id}
      basePath={basePath}
      resource={resource}
      rowClick={rowClick}
      onClickCapture={handleClickCapture}
      onAuxClick={handleAuxClick}
    />
  );
};

const datagridBody = <DatagridBody row={<NewTabAwareRow />} />;

/**
 * `Datagrid` de react-admin, dont les lignes s'ouvrent dans un nouvel onglet au
 * Ctrl/Cmd+clic et au clic molette. Interchangeable avec celui de react-admin.
 *
 * `body` est posé avant l'étalement des props pour rester surchargeable.
 */
export const Datagrid = props => <RaDatagrid body={datagridBody} {...props} />;

export default Datagrid;
