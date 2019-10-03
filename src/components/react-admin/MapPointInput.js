import React from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import { addField } from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import { withStyles } from '@material-ui/core/styles';

import compose from '../../utils/compose';
import { withMapConfig } from '../../hoc/withAppSettings';

let Map = null; // For the mapbox gl component

const styles = theme => ({
  marker: {
    display: 'block',
    borderRadius: '50%',
    width: '1em',
    height: '1em',
    border: `.25em solid ${theme.palette.primary.main}`,
  },
});

const MapPointInput = ({ classes, input, center, mapConfig }) => {
  const [loaded, setLoaded] = React.useState(false);
  const handleMapClick = (map, { lngLat }) => {
    const coords = Object.values(lngLat).map(value => Number(value.toFixed(7)));
    input.onChange(coords);
  };

  const customProps = {};

  if (input.value) {
    customProps.center = input.value;
  }

  React.useEffect(() => {
    if (mapConfig.accessToken) {
      Map = ReactMapboxGl({
        accessToken: mapConfig.accessToken,
      });
      setLoaded(true);
    }
  }, [mapConfig.accessToken]);

  return (
    (loaded && (
    <Map
      style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line react/style-prop-object
      containerStyle={{ height: '300px' }}
      center={center}
      onClick={handleMapClick}
      {...customProps}
    >
      {!!input.value && (
        <Marker coordinates={input.value} anchor="center">
          <span className={classes.marker} />
        </Marker>
      )}
    </Map>
    ))
  );
};

export default compose(
  addField,
  withStyles(styles),
  withMapConfig,
)(MapPointInput);
