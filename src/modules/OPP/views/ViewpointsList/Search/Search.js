import React from 'react';

import { Tab, Tabs } from '@blueprintjs/core';
import i18n from 'i18next';

import { fetchFilterOptions } from '../../../services/viewpoints';
import { configSimplesSearch, configAdvancedSearch } from './utils/configForm';
import { schema } from './utils/schemaForm';

import SearchForm from './SearchForm';

import './search.scss';

const ID_SEARCH_PANEL = 'search';
const ID_SEARCH_SIMPLE = 'searchSimple_tab';
const ID_SEARCH_ADVANCED = 'searchAdvanced_tab';

const locales = {
  noResults: i18n.t('opp.viewpoint.filter.no-result'),
  overlappingDatesMessage: i18n.t('date.error.overlapping-date'),
  invalidDateMessage: i18n.t('date.error.invalid-date'),
  emptySelectItem: i18n.t('opp.viewpoint.filter.empty-selected-input'),
};

function getValuesFilters (schemaForm, data) {
  return schemaForm.map(filter => {
    const values = typeof data[filter.name] !== 'undefined'
      ? { values: data[filter.name] }
      : {};
    return { ...filter, ...values };
  });
}

function getFilterBySearch (schemaForm, config) {
  return config.map(name => {
    const index = schemaForm.findIndex(filter => filter.name === name);
    return { ...schemaForm[index] };
  });
}

export class Search extends React.Component {
  state = {
    navTabId: ID_SEARCH_SIMPLE,
    simplesSearchFilters: [],
    advancedSearchFilters: [],
  };

  componentDidMount () {
    this.getFilters();
  }

  handleNavSearchTabChange = navTabId => this.setState({ navTabId });

  getFilters = async () => {
    try {
      const data = await fetchFilterOptions();
      const filters = getValuesFilters(schema, data);
      const simplesSearchFilters = getFilterBySearch(filters, configSimplesSearch);
      const advancedSearchFilters = getFilterBySearch(filters, configAdvancedSearch);
      this.setState({ simplesSearchFilters, advancedSearchFilters });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  render () {
    const {
      navTabId,
      simplesSearchFilters,
      advancedSearchFilters,
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
              filters={simplesSearchFilters}
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
              filters={advancedSearchFilters}
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
