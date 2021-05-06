import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Intent } from '@blueprintjs/core';
import Message from '../../../../../../../components/Message';

import CategoryItem from '../CategoryItem';

const CategoryList = ({ categories, name, t, ...rest }) => {
  const categoryListFilled = useMemo(() =>
    categories.filter(category => category[name].length > 0),
  [categories, name]);

  if (!categoryListFilled.length) {
    return (
      <Message intent={Intent.PRIMARY}>
        {t('CRUD.details.attachment.empty')}
      </Message>
    );
  }

  return (
    <>
      {categoryListFilled.map(({ category, [name]: attachments }) => (
        <CategoryItem
          key={category.id}
          category={category}
          attachments={attachments}
          name={name}
          {...rest}
        />
      ))}
    </>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  name: PropTypes.oneOf(['attachments', 'pictures']),
  t: PropTypes.func,
};

CategoryList.defaultProps = {
  categories: [],
  name: 'attachments',
  t: () => {},
};

export default CategoryList;
