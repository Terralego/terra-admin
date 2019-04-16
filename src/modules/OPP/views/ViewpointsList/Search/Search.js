import React from 'react';

import { Tab, Tabs } from '@blueprintjs/core';

import { schemaSimpleSearch, schemaAdvancedSearch } from './schemaForm';

import SimpleSearch from './TabsContent/SimpleSearch';
import AdvancedSearch from './TabsContent/AdvancedSearch';

import './search.scss';

const ID_SEARCH_PANEL = 'search';
const ID_SEARCH_SIMPLE = 'searchSimple_tab';
const ID_SEARCH_ADVANCED = 'searchAdvanced_tab';


export class Search extends React.PureComponent {
  state = {
    navTabId: ID_SEARCH_SIMPLE,
  };

  handleNavSearchTabChange = navTabId => this.setState({ navTabId });

  render () {
    const { navTabId } = this.state;
    const { itemsPerPage } = this.props;
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
          title="Recherche Simple"
          panel={(
            <SimpleSearch
              itemsPerPage={itemsPerPage}
              filters={schemaSimpleSearch}
            />
          )}
        />

        <Tab
          id={ID_SEARCH_ADVANCED}
          className="search-filters search-advanced-content"
          title="Recherche Avancée"
          panel={(
            <AdvancedSearch
              itemsPerPage={itemsPerPage}
              filters={schemaAdvancedSearch}
            />
          )}
        />
      </Tabs>
    );
  }
}

export default Search;
