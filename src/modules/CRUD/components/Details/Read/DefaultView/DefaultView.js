import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@blueprintjs/core';
import { NavLink, useParams } from 'react-router-dom';

import { generateURI } from '../../../../config';

import PropertyList from '../../PropertyList';

const DefaultView = ({ properties }) => {
  const tabs = useMemo(() => Object.values(properties)
    .sort((a, b) => a.order - b.order),
  [properties]);

  const {
    category,
    id,
    layer,
    section = 'default',
  } = useParams();

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
          panel={<PropertyList properties={propertiesFromTab} />}
        />
      ))}
      <Tabs.Expander />
    </Tabs>
  );
};

DefaultView.propTypes = {
  properties: PropTypes.shape({}),
};

DefaultView.defaultProps = {
  properties: {},
};

export default DefaultView;
