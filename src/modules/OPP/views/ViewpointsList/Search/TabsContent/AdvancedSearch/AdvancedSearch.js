import React from 'react';

import { Button } from '@blueprintjs/core';

import Filters from 'mc-tf-test/modules/Forms/Filters';
import { toast } from '../../../../../utils/toast';
import { isDate, parsePropertiesToData } from '../../../../../utils/validateFilters';

import '../tabs-content.scss';

export class AdvancedSearch extends React.Component {
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
    const {
      t,
      getFirstPageFilteredViewpointsAction,
      itemsPerPage,
    } = this.props;
    this.setState({ formValidation: 1 });
    const { properties } = this.state;
    const filters = properties ? parsePropertiesToData(properties) : {};
    const res = await getFirstPageFilteredViewpointsAction(filters, itemsPerPage, 1);
    !res && toast.displayError(t('opp.form.error'));
    this.setState({ formValidation: 0 });
  };

  render () {
    const { properties, formValidation } = this.state;
    const {
      filters,
      locales,
      t,
    } = this.props;

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
            text={t('form.reset')}
            onClick={this.onReset}
          />
          <Button
            text={t('form.search')}
            type="submit"
            loading={isDisabled}
            disabled={isDateInvalid || isDisabled}
          />
        </div>
      </form>
    );
  }
}

export default AdvancedSearch;
