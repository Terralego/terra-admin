import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@blueprintjs/core';
import { Redirect, Link } from 'react-router-dom';
import classnames from 'classnames';

import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Header from '../Header';
import Actions from '../Actions';

const NO_FEATURE = 'CRUD.details.noFeature';

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
    return t(NO_FEATURE);
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
                {columns.map(th => <th key={th}>{th}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  {row.map(td => <td key={td}>{td}</td>)}
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


class Read extends React.Component {
  state = {
    tabs: [],
  }

  componentDidMount () {
    this.generatesTabs();
  }

  componentDidUpdate ({
    feature: { display_properties: prevDisplayProperties },
  }) {
    const {
      feature: { display_properties: displayProperties },
    } = this.props;
    if (prevDisplayProperties !== displayProperties) {
      this.generatesTabs();
    }
  }

  generatesTabs = () => {
    const {
      feature: { display_properties: displayProperties },
    } = this.props;
    this.setState({
      tabs: Object.keys(displayProperties)
        .map(tabs => ({ ...displayProperties[tabs] }))
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
      match: { params: { layer: paramLayer, id: paramId } },
      location: { hash },
      displayViewFeature,
      feature: { title: featureTitle, documents },
    } = this.props;

    if (!displayViewFeature) {
      toast.displayError(t('CRUD.details.noAccess'));
      return (<Redirect to={generateURI('layer', { layer: paramLayer })} />);
    }

    const { tabs } = this.state;
    const hasProperties = !!tabs.length;

    return (
      <div className="details">
        <Header title={featureTitle || t(NO_FEATURE)} documents={documents} />
        {hasProperties && (
          <div className="details__content">
            <Tabs
              id="tabs"
              selectedTabId={hash.substring(1) || tabs[0].slug}
            >
              {tabs.map(({ title, slug = 'other', properties }) => (
                <Tab
                  key={slug}
                  id={slug}
                  title={<Link to={`#${slug}`}>{title || t('CRUD.details.other')}</Link>}
                  panel={this.renderPanel(properties)}
                />
              ))}
              <Tabs.Expander />
            </Tabs>
          </div>
        )}
        <Actions paramId={paramId} paramLayer={paramLayer} displayUpdate displayDelete />
      </div>
    );
  }
}

Read.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
  location: PropTypes.shape({
    hash: PropTypes.string,
  }),
  displayViewFeature: PropTypes.bool,
  feature: PropTypes.shape({
    title: PropTypes.string,
    documents: PropTypes.array,
    display_properties: PropTypes.shape({}),
  }),
  t: PropTypes.func,
};

Read.defaultProps = {
  match: {
    params: {
      layer: undefined,
      id: undefined,
    },
  },
  location: PropTypes.shape({
    hash: undefined,
  }),
  displayViewFeature: true,
  feature: {
    title: '',
    documents: [],
    display_properties: {},
  },
  t: text => text,
};

export default Read;
