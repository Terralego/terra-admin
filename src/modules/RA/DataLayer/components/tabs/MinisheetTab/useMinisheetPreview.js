import React from 'react';
import debounce from 'lodash.debounce';
import { useTranslate } from 'react-admin';
import { useFormState } from 'react-final-form';
import { useLocation } from 'react-router-dom';

import { writeMinisheetConfig } from './minisheetBlocks';

/**
 * Lifts the minisheet config up to the aside of the view.
 *
 * The aside is a sibling of the form in react-admin, not a child, so it has no
 * access to the form: the minisheet tab publishes the config in this context,
 * which the view provides and hands down to the aside.
 */
const MinisheetPreviewContext = React.createContext(() => {});

export const MinisheetPreviewProvider = MinisheetPreviewContext.Provider;

/**
 * View side: the published config and source, and whether to show them.
 * Nothing published (another tab is open, or the minisheet is off): no aside
 * nor toggle. The entity picked in the aside lives here, to outlast a switch of
 * tab.
 */
export const useMinisheetPreview = () => {
  const [preview, setPreview] = React.useState(null);
  const publish = React.useMemo(() => debounce(setPreview, 300), []);
  React.useEffect(() => () => publish.cancel(), [publish]);

  const [open, setOpen] = React.useState(true);
  const toggle = React.useCallback(() => setOpen(previous => !previous), []);

  const [picked, setPicked] = React.useState({});
  const source = preview?.source;
  const entity = picked.source === source ? picked.entity : undefined;
  const setEntity = React.useCallback(value => setPicked({ source, entity: value }), [source]);

  return {
    preview: preview && { ...preview, entity, setEntity },
    publish,
    open,
    toggle,
    available: Boolean(preview),
  };
};

/**
 * Form side: publishes the config as it would be saved, with the source, while
 * the minisheet tab is the one displayed and the minisheet is on. React-admin
 * keeps every tab mounted, hence the check on the route.
 */
export const MinisheetPreviewPublisher = () => {
  const publish = React.useContext(MinisheetPreviewContext);
  const translate = useTranslate();
  const { pathname } = useLocation();
  const active = pathname.endsWith('/minisheet');
  const { values: { minisheet_config: config, fields = [], source } } = useFormState({
    subscription: { values: true },
  });

  React.useEffect(() => {
    if (!active || !config?.enable || !source) {
      publish(null);
      return;
    }
    let count = 0;
    const createId = () => `b-${(count += 1)}`;
    publish({ config: writeMinisheetConfig(config, fields, { translate, createId }), source });
  }, [publish, active, config, fields, source, translate]);

  React.useEffect(() => () => publish(null), [publish]);

  return null;
};

export default useMinisheetPreview;
