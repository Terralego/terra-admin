import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Navbar } from '@blueprintjs/core';

import AttachmentList from '../AttachmentList';

const CategoryList = ({ categories, name }) => {
  const categoryListFilled = useMemo(() =>
    categories.filter(category => category[name].length > 0),
  [categories, name]);

  return (
    <>
      {categoryListFilled.map(({ category, [name]: attachments }) => (
        <Fragment key={category.id}>
          <Navbar>
            <Navbar.Group>
              <Navbar.Heading>{category.name}</Navbar.Heading>
            </Navbar.Group>
          </Navbar>
          <AttachmentList attachments={attachments} name={name} />
        </Fragment>
      ))}
    </>
  );
};

CategoryList.propTypes = {
  name: PropTypes.oneOf(['attachments', 'pictures']),
  categories: PropTypes.arrayOf(PropTypes.shape({})),
};

CategoryList.defaultProps = {
  name: 'attachments',
  categories: [],
};

export default CategoryList;
