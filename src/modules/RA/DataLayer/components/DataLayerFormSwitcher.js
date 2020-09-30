import React from 'react';

import { useGetOne } from 'react-admin';
import { useField } from 'react-final-form';

import { WMTS } from '../../DataSource';
import { RES_DATASOURCE } from '../../ra-modules';

const DataLayerFormSwitcher = ({ onSwitch = () => {} }) => {
  const { input: { value: sourceId } } = useField('source');
  const { data: { _type: type } = {} } = useGetOne(RES_DATASOURCE, sourceId);

  React.useEffect(() => onSwitch(type === WMTS), [onSwitch, type]);

  return null;
};

export default DataLayerFormSwitcher;
