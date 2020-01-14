import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { parseUrl } from 'query-string';

import {
  Alignment,
  Classes,
  Label,
  Navbar,
  NavbarGroup,
  HTMLSelect as Select,
} from '@blueprintjs/core';

import './styles.scss';

const PAGINATION_RANGE_DISPLAYED = 4;

const getPageFromUrl = string => {
  if (string === null) {
    return null;
  }
  const { query: { page } } = parseUrl(string);
  return Number(page);
};

const getCurrentPage = (prevPage, nextPage) => {
  if (prevPage === null && nextPage === null) {
    return null;
  }
  return prevPage ? prevPage + 1 : nextPage - 1;
};

const Footer = ({
  featuresList: { count = 0, previous = null, next = null } = {},
  onPageChange,
  pageSize,
  querystring: { page },
  setPageSize,
  t,
}) => {
  const prevPage = getPageFromUrl(previous);
  const nextPage = getPageFromUrl(next);
  const currentPage = getCurrentPage(prevPage, nextPage);

  if (currentPage === null || !count) {
    return null;
  }

  const forcePage = (page || currentPage) - 1;
  const pageCount = Math.ceil(count / pageSize);
  const pageRangeDisplayed = Math.min(pageCount, PAGINATION_RANGE_DISPLAYED);

  return (
    <Navbar className="table-footer">
      <NavbarGroup align={Alignment.CENTER}>
        <div className="table-footer__form">
          <Label className={`table-footer__label ${Classes.INLINE}`}>
            {t('CRUD.table.pagination.display')}
            <Select
              className={Classes.INLINE}
              aria-describedby="table-footer__results"
              onChange={({ target: { value } }) => {
                const nextPageSize = Number(value);
                setPageSize(nextPageSize);
                onPageChange({ nextPageSize });
              }}
              options={[10, 20, 50]}
              value={pageSize}
            />
            <span className={Classes.INLINE} id="table-footer__results"> {t('CRUD.table.pagination.results')}</span>
          </Label>
        </div>
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={pageRangeDisplayed}
          marginPagesDisplayed={1}
          pageLinkClassName={Classes.BUTTON}
          breakLinkClassName={Classes.BUTTON}
          previousLinkClassName={Classes.BUTTON}
          nextLinkClassName={Classes.BUTTON}
          activeLinkClassName={Classes.ACTIVE}
          disabledClassName={Classes.DISABLED}
          previousLabel={t('common.pagination.previous')}
          nextLabel={t('common.pagination.next')}
          onPageChange={onPageChange}
          containerClassName="table-footer__pagination"
          forcePage={forcePage}
        />
      </NavbarGroup>
    </Navbar>
  );
};

Footer.propTypes = {
  featuresList: PropTypes.shape({
    count: PropTypes.number,
    previous: PropTypes.string,
    next: PropTypes.string,
  }),
  onPageChange: PropTypes.func,
  pageSize: PropTypes.number,
  querystring: PropTypes.shape({
    page: PropTypes.number,
  }),
  setPageSize: PropTypes.func,
  t: PropTypes.func,
};

Footer.defaultProps = {
  featuresList: {},
  onPageChange: () => {},
  pageSize: 10,
  querystring: {},
  setPageSize: () => {},
  t: text => text,
};

export default Footer;
