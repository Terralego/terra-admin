import React from 'react';
import debounce from 'lodash.debounce';

/**
 * Wires the live preview of a base layer form to its aside.
 *
 * The aside is a sibling of the form in react-admin, not a child, so it has no
 * access to the form context: the values are lifted up to the view holding both
 * and pushed back down. Debounced, or the map style would be rebuilt on every
 * keystroke of a tiles URL.
 */
export const usePreview = () => {
  const [values, setValues] = React.useState();
  const onValuesChange = React.useMemo(() => debounce(setValues, 500), []);
  React.useEffect(() => () => onValuesChange.cancel(), [onValuesChange]);

  const [open, setOpen] = React.useState(true);
  const toggle = React.useCallback(() => setOpen(previous => !previous), []);

  return { values, onValuesChange, open, toggle };
};

export default usePreview;
