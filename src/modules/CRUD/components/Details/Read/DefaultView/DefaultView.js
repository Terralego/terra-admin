import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import { generateURI } from '../../../../config';

import PropertyItem from '../../PropertyItem';
import Actions from '../../Actions';

class DefaultView extends React.Component {
  state = {
    tabs: [],
  }

  componentDidMount () {
    this.generatesTabs();
  }

  componentDidUpdate ({
    properties: prevProperties,
  }) {
    const { properties } = this.props;
    if (prevProperties !== properties) {
      this.generatesTabs();
    }
  }

  generatesTabs = () => {
    const {
      properties,
    } = this.props;
    this.setState({
      tabs: Object.keys(properties)
        .map(tabs => ({ ...properties[tabs] }))
        .sort((a, b) => a.order - b.order),
    });
  }

  renderPanel = properties => (
    <ul className="details__list">
      {Object.entries(properties).map(([key, value]) => (
        <PropertyItem key={key} value={value} />
      ))}
    </ul>
  )

  render () {
    const {
      t,
      match: { params: { layer, id, action = 'read', section = 'default', category } },
    } = this.props;

    const { tabs } = this.state;
    const hasProperties = !!tabs.length;

    return (
      <>
        {hasProperties && (
        <Tabs
          selectedTabId={category || tabs[0].slug}
        >
          {tabs.map(({ title, slug = 'other', properties }) => (
            <Tab
              key={slug}
              id={slug}
              title={<NavLink to={generateURI('layer', { layer, id, action, section, category: slug })}>{title || t('CRUD.details.other')}</NavLink>}
              panel={this.renderPanel(properties)}
            />
          ))}
          <Tabs.Expander />
        </Tabs>
        )}
        <Actions paramId={id} paramLayer={layer} displayUpdate displayDelete />
      </>
    );
  }
}

DefaultView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
      action: PropTypes.string,
      section: PropTypes.string,
      category: PropTypes.string,

    }),
  }),
  location: PropTypes.shape({
    hash: PropTypes.string,
  }),
  properties: PropTypes.shape({}),
  t: PropTypes.func,
};

DefaultView.defaultProps = {
  match: {
    params: {
      layer: undefined,
      id: undefined,
      action: undefined,
      section: undefined,
      category: undefined,
    },
  },
  location: PropTypes.shape({
    hash: undefined,
  }),
  properties: {},
  t: text => text,
};

export default DefaultView;
