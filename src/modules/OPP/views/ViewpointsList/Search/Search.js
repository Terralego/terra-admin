import React from 'react';

import { Tab, Tabs } from '@blueprintjs/core';
import i18n from 'i18next';

import { schemaSimpleSearch, schemaAdvancedSearch } from './schemaForm';
import SearchForm from './SearchForm';

import './search.scss';
import { fetchValuesToFiltering } from '../../../services/viewpoints';

const ID_SEARCH_PANEL = 'search';
const ID_SEARCH_SIMPLE = 'searchSimple_tab';
const ID_SEARCH_ADVANCED = 'searchAdvanced_tab';

const locales = {
  noResults: i18n.t('opp.viewpoint.filter.no-result'),
  overlappingDatesMessage: i18n.t('date.error.overlapping-date'),
  invalidDateMessage: i18n.t('date.error.invalid-date'),
  emptySelectItem: i18n.t('opp.viewpoint.filter.empty-selected-input'),
};

export class Search extends React.Component {
  state = {
    navTabId: ID_SEARCH_SIMPLE,
    filtersOfSimpleSearch: [],
    filtersOfAdvancedSearch: [],
  };

  componentDidMount () {
    this.getFilters();
  }

  handleNavSearchTabChange = navTabId => this.setState({ navTabId });

  getValuesFilters = (schemaForm, data) => {
    const keys = Object.keys(data);

    return schemaForm.map(filter => {
      if (keys.indexOf(filter.name) > -1) {
        return { ...filter, ...{ values: data[filter.name] } };
      }
      return { ...filter };
    });
  };

  getFilters = async () => {
    try {
      const data = await fetchValuesToFiltering();
      const filtersOfSimpleSearch = this.getValuesFilters(schemaSimpleSearch, data);
      const filtersOfAdvancedSearch = this.getValuesFilters(schemaAdvancedSearch, data);

      this.setState({ filtersOfSimpleSearch, filtersOfAdvancedSearch });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  render () {
    const {
      navTabId,
      filtersOfSimpleSearch,
      filtersOfAdvancedSearch,
    } = this.state;
    const {
      itemsPerPage,
      t,
      handleResetPage,
    } = this.props;

    return (
      <Tabs
        id={ID_SEARCH_PANEL}
        onChange={this.handleNavSearchTabChange}
        selectedTabId={navTabId}
        className="search"
      >
        <Tab
          id={ID_SEARCH_SIMPLE}
          className="search-filters search-simple-content"
          title={t('opp.viewpoint.filter.simple-search')}
          panel={(
            <SearchForm
              itemsPerPage={itemsPerPage}
              filters={filtersOfSimpleSearch}
              locales={locales}
              handleResetPage={handleResetPage}
            />
          )}
        />

        <Tab
          id={ID_SEARCH_ADVANCED}
          className="search-filters search-advanced-content"
          title={t('opp.viewpoint.filter.advanced-search')}
          panel={(
            <SearchForm
              itemsPerPage={itemsPerPage}
              filters={filtersOfAdvancedSearch}
              locales={locales}
              handleResetPage={handleResetPage}
            />
          )}
        />
      </Tabs>
    );
  }
}

export default Search;
