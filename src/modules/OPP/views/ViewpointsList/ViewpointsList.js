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
import { toast } from '../../utils/toast';

const itemsPerPage = 14;

export class ViewpointList extends React.PureComponent {
  state = {
    page: 0,
  };

  async componentDidMount () {
    const { getFirstPageFilteredViewpointsAction } = this.props;
    await getFirstPageFilteredViewpointsAction({}, itemsPerPage, 1);
  }

  handleResetPageFromSearch = () => this.setState({ page: 0 });

  handlePageClick = ({ selected }) => {
    const { getPaginatedViewpointsAction } = this.props;
    getPaginatedViewpointsAction(itemsPerPage, selected + 1);
    this.setState({ page: selected });
    window.scrollTo(0, 0);
  };

  render () {
    const { page } = this.state;
    const {
      viewpointsList: { results = [], count, num_pages: numPages } = {},
      t,
      isLoading,
      codeError,
    } = this.props;

    return (
      <>
        {codeError && toast.displayError(t('opp.form.error.server'))}
        <Search
          itemsPerPage={itemsPerPage}
          handleResetPage={this.handleResetPageFromSearch}
        />
        <div className="viewpoint-list">
          <div className="page--title">
            <H2>{t('opp.viewpoints.title')}</H2>
          </div>
          <div className="page--content">
            {codeError && (
              <p>Server error</p>
            )}
            {!codeError && (
              <>
                <ViewpointAddItem />
                {isLoading && (
                  <Loading />
                )}
                {!isLoading && (
                  <>
                    {results.map(viewpoint => (
                      <ViewpointsListItem
                        key={viewpoint.id}
                        {...viewpoint}
                      />
                    ))}
                    {count > itemsPerPage && (
                      <>
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
                          forcePage={page}
                        />
                      </>
                    )}
                    {count === 0 && (
                      <div>
                        <Card>
                          <img src={noResult} alt="No result" />
                          <h3>{t('opp.form.no-result')}</h3>
                        </Card>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default ViewpointList;
