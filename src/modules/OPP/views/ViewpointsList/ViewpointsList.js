import React from 'react';
import {
  Card,
  H2,
} from '@blueprintjs/core';
import ReactPaginate from 'react-paginate';

import ViewpointsListItem from './ViewpointsListItem';
import ViewpointAddItem from './AddViewpoint';
import Search from './Search';
import Loading from '../../../../components/Loading';
import noResult from '../../images/no_result.png';

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
    window.scrollTo(0, 0);
  };

  render () {
    const {
      viewpointsList: { results = [], count, num_pages: numPages } = {},
      t,
      isLoading,
    } = this.props;
    return (
      <>
        <Search
          itemsPerPage={itemsPerPage}
        />
        <div className="viewpoint-list">
          <div className="page--title">
            <H2>{t('opp.viewpoints.title')}</H2>
          </div>
          <div className="page--content">
            <ViewpointAddItem />
            {!isLoading ? (
              <>
              {results.map(viewpoint => (
                <ViewpointsListItem
                  key={viewpoint.id}
                  {...viewpoint}
                />
                ))}
                {count > itemsPerPage && (
                  <ReactPaginate
                    previousLabel={t('common.pagination.previous')}
                    nextLabel={t('common.pagination.next')}
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={numPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName="pagination"
                    subContainerClassName="pages pagination"
                    activeClassName="active"
                  />
                )}
                {count === 0 && (
                  <div>
                    <Card>
                      <img src={noResult} alt="No result" />
                      <h3> Oups, il n'y a pas de résultats à votre recherche.</h3>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default ViewpointList;
