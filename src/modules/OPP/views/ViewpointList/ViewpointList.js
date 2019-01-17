import React from 'react';
import {
  H2,
} from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import ViewpointListItem from './ViewpointListItem';
import ViewpointAddItem from './ViewpointAddItem';
import './viewpoint-list.scss';

export class ViewpointList extends React.Component {
  componentDidMount () {
    const { fetchViewpoints } = this.props;
    fetchViewpoints();
  }

  render () {
    const { viewpointsList, t } = this.props;
    return (
      <>
        <div className="page--title">
          <H2>{t('opp.title.viewpoints')}</H2>
        </div>
        <div className="viewpoint-list">
          <ViewpointAddItem />
          {viewpointsList.map(viewpoint => (
            <ViewpointListItem
              key={viewpoint.id}
              {...viewpoint}
            />
          ))}
        </div>
      </>
    );
  }
}

export default withNamespaces()(ViewpointList);
