import React from 'react';

import Thead from './Thead';
import Tbody from './Tbody';

import './styles.scss';

const TableField = props => {
  const {
    schema: { title },
  } = props;

  return (
    <fieldset className="field field-array field-array-of-object">
      {title && <legend>{title}</legend>}
      <div className="details__table tableField">
        <table>
          <Thead {...props} />
          <Tbody {...props} />
        </table>
      </div>
    </fieldset>
  );
};

TableField.propTypes = {
  ...Thead.propTypes,
  ...Tbody.propTypes,
};

TableField.defaultProps = {
  ...Thead.defaultProps,
  ...Tbody.defaultProps,
};

export default TableField;
