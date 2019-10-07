import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { orderProperties } from 'react-jsonschema-form/lib/utils';

import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import DownloadButtons from '../DownloadButtons';
import Actions from '../Actions';

const NO_FEATURE = 'CRUD.details.noFeature';
const emptyStringOrUndef = value => ['', undefined].includes(value);


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

  if (emptyStringOrUndef(value)) {
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
    return value.join(', ');
  }

  return value;
};

const Read = ({
  t,
  match: { params: { layer: paramLayer, id: paramId } },
  schema: { title: schemaTitle, properties = {} },
  displayViewFeature,
  view: { uiSchema: { 'ui:order': order } = {} },
  feature: { documents },
}) => {
  if (!displayViewFeature) {
    toast.displayError(t('CRUD.details.noAccess'));
    return (<Redirect to={generateURI('layer', { layer: paramLayer })} />);
  }

  const { name: { default: title } = {} } = properties;
  const hasProperties = !!Object.keys(properties).length;

  const orderedProperties = orderProperties(Object.keys(properties), order);

  return (
    <div className="details">
      <div className="details__header">
        <h2 className="details__title">{title || t(NO_FEATURE)}</h2>
        <DownloadButtons
          className="details__templates"
          documents={documents}
        />
      </div>
      {hasProperties && (
        <div className="details__content">
          {schemaTitle && (
            <h3 className="details__subtitle">{schemaTitle}</h3>
          )}
          <ul className="details__list">
            {orderedProperties.map(prop => (
              <li key={prop} className="details__list-item">
                <strong className="details__list-label">{properties[prop].title || prop}</strong>
                <span className={classnames(
                  'details__list-value',
                  { 'details__list-value--empty': emptyStringOrUndef(properties[prop].default) },
                )}
                >
                  {formattedProp({ value: properties[prop].default, t })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Actions paramId={paramId} paramLayer={paramLayer} displayUpdate displayDelete />
    </div>
  );
};

Read.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
  schema: PropTypes.shape({
    properties: PropTypes.shape({}),
  }),
  displayViewFeature: PropTypes.bool,
  view: PropTypes.shape({
    uiSchema: PropTypes.shape({}),
  }),
  feature: PropTypes.shape({
    documents: PropTypes.array,
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
  schema: {
    properties: {},
  },
  displayViewFeature: true,
  view: {
    uiSchema: {},
  },
  feature: {
    documents: [],
  },
  t: text => text,
};

export default Read;
