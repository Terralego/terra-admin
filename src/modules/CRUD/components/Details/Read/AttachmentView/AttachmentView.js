import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import { generateURI } from '../../../../config';

import CategoryList from './CategoryList';
import './styles.scss';


const AttachmentView = ({
  match: { params: { layer, id, section, category } },
  t,
}) => {
  const tabs = useMemo(() => [
    { name: 'attachments', label: t('CRUD.details.attachment.files') },
    { name: 'pictures', label: t('CRUD.details.attachment.images') },
  ], [t]);

  return (
    <Tabs
      selectedTabId={category || tabs[0].name}
      className="attachment"
      renderActiveTabPanelOnly
    >
      {tabs.map(tab => (
        <Tab
          key={tab.name}
          id={tab.name}
          title={<NavLink to={generateURI('layer', { layer, id, section, category: tab.name })}>{tab.label}</NavLink>}
          panel={(
            <CategoryList {...tab} />
          )}
        />
      ))}
    </Tabs>
  );
};

AttachmentView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
      section: PropTypes.string,
      category: PropTypes.string,
    }),
  }),
  t: PropTypes.func,
};

AttachmentView.defaultProps = {
  match: {
    params: {
      layer: undefined,
      id: undefined,
      section: undefined,
      category: undefined,
    },
  },
  t: text => text,
};

export default AttachmentView;
