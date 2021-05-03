import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@blueprintjs/core';
import { NavLink, useParams } from 'react-router-dom';

import { generateURI } from '../../../../config';

import PropertyList from '../../PropertyList';

const DefaultView = ({ displayProperties, properties }) => {
  const tabs = useMemo(() => Object.values(displayProperties)
    .sort((a, b) => a.order - b.order),
  [displayProperties]);
  const {
    category,
    id,
    layer,
    section = 'default',
  } = useParams();


  const editProperties = useMemo(() => (
    Object.values(properties).reduce((list, item) => ({ ...list, ...item }), {})
  ), [properties]);

  const { t } = useTranslation();

  if (!tabs.length) {
    return null;
  }

  return (
    <Tabs
      selectedTabId={category || tabs[0].slug}
    >
      {tabs.map(({ title, slug = 'other', properties: propertiesFromTab }) => (
        <Tab
          key={slug}
          id={slug}
          title={<NavLink to={generateURI('layer', { layer, id, section, category: slug })}>{title || t('CRUD.details.other')}</NavLink>}
          panel={<PropertyList properties={propertiesFromTab} editProperties={editProperties} />}
        />
      ))}
      <Tabs.Expander />
    </Tabs>
  );
};

DefaultView.propTypes = {
  displayProperties: PropTypes.shape({}),
  properties: PropTypes.shape({}),
};

DefaultView.defaultProps = {
  displayProperties: {},
  properties: {},
};

export default DefaultView;
