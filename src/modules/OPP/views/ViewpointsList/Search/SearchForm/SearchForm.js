import React from 'react';

import { Button } from '@blueprintjs/core/lib/esm/index';

import Filters from '@terralego/core/modules/Forms/Filters';
import { isDate, parsePropertiesToData } from '../../../../utils/validateFilters';

import './search-form.scss';

// Prevent trigger onSubmit when press enter into input
function onKeyPress (event) {
  if (event.which === 13 /* Enter */) {
    event.preventDefault();
  }
}

export class SearchForm extends React.Component {
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

  onSubmit = async event => {
    event.preventDefault();
    const {
      getFirstPageFilteredViewpointsAction,
      itemsPerPage,
      handleResetPage,
    } = this.props;
    this.setState({ formValidation: 1 });
    const { properties } = this.state;
    const data = properties ? parsePropertiesToData(properties) : {};
    await getFirstPageFilteredViewpointsAction(data, itemsPerPage, 1);
    this.setState({ formValidation: 0 });
    handleResetPage();
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
      <form onSubmit={this.onSubmit} onKeyPress={onKeyPress} role="presentation">
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

export default SearchForm;
