import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Intent } from '@blueprintjs/core';
import Message from '../../../../../../../components/Message';

import AttachmentList from '../AttachmentList';

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
        <Fragment key={category.id}>
          <Navbar>
            <Navbar.Group>
              <Navbar.Heading>{category.name}</Navbar.Heading>
            </Navbar.Group>
          </Navbar>
          <AttachmentList
            attachments={attachments}
            name={name}
            {...rest}
          />
        </Fragment>
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
