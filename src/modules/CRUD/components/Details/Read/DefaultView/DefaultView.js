import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { generateURI } from '../../../../config';

import Actions from '../../Actions';

const emptyStringNullOrUndef = value => ['', null, undefined].includes(value);

const haveStrictlySameValues = (arr1 = [], arr2 = []) => {
  // @Todo: Memoize serialize function
  const serialize = arr => [...arr].sort().join();
  return serialize(arr1) === serialize(arr2);
};

const isTableObject = (arrayOfObjects = []) => {
  const firstKeys = Object.keys(arrayOfObjects[0]);
  return arrayOfObjects.every(item => haveStrictlySameValues(Object.keys(item), firstKeys));
};

const isHTML = value => {
  const div = document.createElement('div');
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return false;
  }
  div.innerHTML = trimmedValue;
  return div.firstChild.nodeType === Node.ELEMENT_NODE;
};

const formattedProp = ({ value, t }) => {
  if (typeof value === 'boolean') {
    return value
      ? t('CRUD.details.true')
      : t('CRUD.details.false');
  }

  if (emptyStringNullOrUndef(value)) {
    return t('CRUD.details.noFeature');
  }

  if (typeof value === 'string') {
    return (
      <div
        className={classnames({
          details__RTE: isHTML(value),
          details__text: !isHTML(value),
        })}
        dangerouslySetInnerHTML={{ __html: value }} // eslint-disable-line react/no-danger
      />
    );
  }

  if (Array.isArray(value)) {
    if (value.some(v => typeof v === 'object')) {
      if (isTableObject(value)) {
        const columns = Object.keys(value[0]);
        const rows = value.map(row => columns.map(col => row[col]));
        return (
          <table className="details__table">
            <thead>
              <tr>
                {columns.map(th => <th key={th}>{formattedProp({ value: th })}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  {row.map(td => <td key={td}>{formattedProp({ value: td })}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      return formattedProp({ value: value.map(val => formattedProp({ value: val })).join('\n') });
    }
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return formattedProp({ value: Object.keys(value).map(key => `${key}: ${value[key]}`) });
  }

  return value;
};


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

  renderPanel = properties => {
    const { t } = this.props;
    return (
      <ul className="details__list">
        {Object.keys(properties).map(name => (
          <li key={name} className="details__list-item">
            <strong className="details__list-label">{name}</strong>
            <span className={classnames(
              'details__list-value',
              { 'details__list-value--empty': emptyStringNullOrUndef(properties[name]) },
            )}
            >
              {formattedProp({ value: properties[name], t })}
            </span>
          </li>
        ))}
      </ul>
    );
  }

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
