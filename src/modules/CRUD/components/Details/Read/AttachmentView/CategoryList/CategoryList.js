import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Intent } from '@blueprintjs/core';
import Message from '../../../../../../../components/Message';

import AttachmentList from '../AttachmentList';

const CategoryList = ({ categories, name, t }) => {
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
          <AttachmentList attachments={attachments} name={name} />
        </Fragment>
      ))}
    </>
  );
};

CategoryList.propTypes = {
  name: PropTypes.oneOf(['attachments', 'pictures']),
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  t: PropTypes.func,
};

CategoryList.defaultProps = {
  name: 'attachments',
  categories: [],
  t: () => {},
};

export default CategoryList;
