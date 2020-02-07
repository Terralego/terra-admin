import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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

const PropertyItem = ({ name, value, t }) => (
  <li key={name} className="details__list-item">
    <strong className="details__list-label">{name}</strong>
    <span className={classnames(
      'details__list-value',
      { 'details__list-value--empty': emptyStringNullOrUndef(value) },
    )}
    >
      {formattedProp({ value, t })}
    </span>
  </li>
);

PropertyItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  t: PropTypes.func,
};

PropertyItem.defaultProps = {
  name: '',
  value: undefined,
  t: text => text,
};

export default PropertyItem;
