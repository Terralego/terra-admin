import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alignment, Button, Navbar } from '@blueprintjs/core';

import AttachmentList from './AttachmentList';
import ImportFile from './ImportFileOpener';


const CategoryItem = ({ category, attachments, name, ...rest }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar>
        <Navbar.Group>
          <Button
            icon={open ? 'chevron-down' : 'chevron-right'}
            minimal
            onClick={() => setOpen(bool => !bool)}
          />
          <Navbar.Heading>{category.name}</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <ImportFile {...rest} category={category} name={name} />
        </Navbar.Group>
      </Navbar>
      {open && (
        <AttachmentList
          attachments={attachments}
          isVisible={open}
          name={name}
          {...rest}
        />
      )}
    </>
  );
};

CategoryItem.propTypes = {
  name: PropTypes.oneOf(['attachments', 'pictures']),
};

CategoryItem.defaultProps = {
  name: 'attachments',

};

export default CategoryItem;
