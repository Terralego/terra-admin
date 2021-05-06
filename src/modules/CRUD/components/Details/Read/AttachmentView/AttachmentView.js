import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Intent, Tab, Tabs } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import { generateURI } from '../../../../config';

import ImportFileOpener from './ImportFileOpener';
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
            <>
              <div className="attachment__header">
                <h3 className="attachment__title">{t('CRUD.details.attachment.category.existing-list')}</h3>
                <div className="attachment__bt-import">
                  <ImportFileOpener {...tab}>
                    <Button
                      icon="cloud-upload"
                      intent={Intent.PRIMARY}
                      text={t('CRUD.details.attachment.add.category')}
                    />
                  </ImportFileOpener>
                </div>
              </div>
              <CategoryList {...tab} editable />
            </>
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
