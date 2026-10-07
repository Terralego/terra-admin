import React from 'react';
import { addField } from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import { withStyles } from '@material-ui/core/styles';

import compose from '../../utils/compose';
import useMaplibreMap from '../Map/useMaplibreMap';
import useMapMarker from '../Map/useMapMarker';

const styles = theme => ({
  map: {
    height: 300,
    width:  600,
    maxWidth: '100%',
  },
  marker: {
    display:      'block',
    borderRadius: '50%',
    width:        '1em',
    height:       '1em',
    border:       `.25em solid ${theme.palette.primary.main}`,
  },
});

const sanitizeRestProps = ({
  basePath, isRequired, record, meta, ressource, ...rest
}) => rest;

const MapPointInput = ({ classes, input, center, ...rest }) => {
  const { value, onChange } = input;

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const handleClick = React.useCallback(({ lngLat }) => {
    onChangeRef.current(
      [lngLat.lng, lngLat.lat].map(coord => Number(coord.toFixed(7))),
    );
  }, []);

  const hasValue = Boolean(value && value[0] && value[1]);

  const { containerRef, mapRef } = useMaplibreMap({
    center:  hasValue ? value : center,
    onClick: handleClick,
  });

  useMapMarker({ mapRef, coordinates: value, className: classes.marker });

  // La carte suit la valeur, qu'elle vienne d'un clic ou d'ailleurs dans le
  // formulaire — c'est ce que faisait la prop `center` de react-mapbox-gl.
  React.useEffect(() => {
    if (mapRef.current && hasValue) {
      mapRef.current.setCenter(value);
    }
  }, [mapRef, hasValue, value]);

  return (
    <div {...sanitizeRestProps(rest)}>
      <div ref={containerRef} className={classes.map} />
    </div>
  );
};

export default compose(
  addField,
  withStyles(styles),
)(MapPointInput);
