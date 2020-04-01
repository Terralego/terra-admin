import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import { generateURI } from '../../../../config';

import PropertyList from '../../PropertyList';

const DefaultView = ({
  match: { params: { layer, id, section = 'default', category } },
  properties,
  t,
}) => {
  const tabs = useMemo(() => Object.values(properties)
    .map(propsValues => ({ ...propsValues }))
    .sort((a, b) => a.order - b.order),
  [properties]);

  if (!tabs.length) {
    return null;
  }

  return (
    <>
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
    </>
  );
};

DefaultView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
      action: PropTypes.string,
      section: PropTypes.string,
      category: PropTypes.string,
    }),
  }),
  location: PropTypes.shape({
    hash: PropTypes.string,
  }),
  properties: PropTypes.shape({}),
  t: PropTypes.func,
};

DefaultView.defaultProps = {
  match: {
    params: {
      layer: undefined,
      id: undefined,
      action: undefined,
      section: undefined,
      category: undefined,
    },
  },
  location: PropTypes.shape({
    hash: undefined,
  }),
  properties: {},
  t: text => text,
};

export default DefaultView;
