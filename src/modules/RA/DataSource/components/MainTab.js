import React from 'react';

import { useField } from 'react-final-form';

import DataSourceMainFields from './DataSourceMainFields';
import DataSourceFileFields from './DataSourceFileFields';
import DataSourceWMTSField from './DataSourceWMTSField';
import DataSourceCSVFields from './DataSourceCSVFields';
import DataSourceDbFields from './DataSourceDbFields';
import {
  SQL,
  GEOJSON,
  SHP,
  WMTS,
  CSV,
} from '..';


const MainTab = props => {
  const { input: { value: type } } = useField('_type');
  return (
    <>
      <DataSourceMainFields {...props} fullWidth />

      {type === WMTS && <DataSourceWMTSField />}
      {[SHP, GEOJSON].includes(type) && <DataSourceFileFields type={type} />}
      {type === SQL && <DataSourceDbFields {...props} fullWidth />}
      {type === CSV && <DataSourceCSVFields type={type} />}
    </>
  );
};

export default MainTab;
