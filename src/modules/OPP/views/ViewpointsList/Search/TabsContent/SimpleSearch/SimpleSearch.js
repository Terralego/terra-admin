import React from 'react';

import { Button } from '@blueprintjs/core';

import Filters from 'mc-tf-test/modules/Forms/Filters';
import { toast } from '../../../../../utils/toast';
import { isDate, parsePropertiesToData } from '../../../../../utils/validateFilters';

import '../tabs-content.scss';

export class SimpleSearch extends React.Component {
  state = {
    properties: {},
    // Inform user of state of form : 0 = clickable, 1 = disabled
    formValidation: 0,
  };

  onChange = properties => {
    this.setState({ properties });
  };

  onReset = () => {
    this.setState({ properties: {} });
  };

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ formValidation: 1 });
    const { properties } = this.state;
    const {
      getFirstPageFilteredViewpointsAction,
      itemsPerPage,
    } = this.props;
    const data = properties ? parsePropertiesToData(properties) : {};
    const res = await getFirstPageFilteredViewpointsAction(data, itemsPerPage, 1);
    !res && toast.displayError('Le serveur est indisponible.');
    this.setState({ formValidation: 0 });
  };

  render () {
    const { properties, formValidation } = this.state;
    const { filters } = this.props;

    const locales = {
      noResults: 'Aucun résultat',
      overlappingDatesMessage: 'Date chevauchante',
      invalidDateMessage: 'Date invalide',
      emptySelectItem: 'Tous',
    };

    const isDateInvalid = properties.viewpointDate
      && !properties.viewpointDate.every(date => isDate(date));

    const isDisabled = formValidation === 1;

    return (
      <form onSubmit={this.onSubmit}>
        <Filters
          locales={locales}
          onChange={this.onChange}
          properties={properties}
          filters={filters}
        />
        <div className="action-search">
          <Button
            text="Réinitialiser"
            onClick={this.onReset}
          />
          <Button
            text="Rechercher"
            type="submit"
            loading={isDisabled}
            disabled={isDateInvalid || isDisabled}
          />
        </div>
      </form>
    );
  }
}

export default SimpleSearch;
