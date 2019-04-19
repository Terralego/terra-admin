import React from 'react';

import { Tab, Tabs } from '@blueprintjs/core';
import i18n from 'i18next';

import { schemaSimpleSearch, schemaAdvancedSearch } from './schemaForm';
import SimpleSearch from './TabsContent/SimpleSearch';

import AdvancedSearch from './TabsContent/AdvancedSearch';
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

export class Search extends React.Component {
  state = {
    navTabId: ID_SEARCH_SIMPLE,
  };

  handleNavSearchTabChange = navTabId => this.setState({ navTabId });

  render () {
    const { navTabId } = this.state;
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
            <SimpleSearch
              itemsPerPage={itemsPerPage}
              filters={schemaSimpleSearch}
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
            <AdvancedSearch
              itemsPerPage={itemsPerPage}
              filters={schemaAdvancedSearch}
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
