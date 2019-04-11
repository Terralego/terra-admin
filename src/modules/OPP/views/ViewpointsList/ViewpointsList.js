import React from 'react';
import {
  H2,
} from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import ReactPaginate from 'react-paginate';

import ViewpointsListItem from './ViewpointsListItem';
import ViewpointAddItem from './AddViewpoint';
import './viewpoint-list.scss';

const itemsPerPage = 14;

export class ViewpointList extends React.Component {
  async componentDidMount () {
    const { getPaginatedViewpointsAction } = this.props;
    await getPaginatedViewpointsAction(itemsPerPage, 1);
  }

  handlePageClick = data => {
    const { getPaginatedViewpointsAction } = this.props;
    const { selected } = data;
    getPaginatedViewpointsAction(itemsPerPage, selected + 1);
  };

  render () {
    const { viewpointsList, t } = this.props;
    return (
      <>
        <div className="page--title">
          <H2>{t('opp.viewpoints.title')}</H2>
        </div>
        <div className="viewpoint-list">
          <ViewpointAddItem />
          {viewpointsList.results &&
            viewpointsList.results.map(viewpoint => (
              <ViewpointsListItem
                key={viewpoint.id}
                {...viewpoint}
              />
            ))
          }
          <ReactPaginate
            previousLabel={t('common.pagination.previous')}
            nextLabel={t('common.pagination.next')}
            breakLabel="..."
            breakClassName="break-me"
            pageCount={viewpointsList.num_pages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
        </div>
      </>
    );
  }
}

export default withNamespaces()(ViewpointList);
