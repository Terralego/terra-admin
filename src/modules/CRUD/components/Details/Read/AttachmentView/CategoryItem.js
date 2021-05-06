import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alignment, Button, Navbar } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

import AttachmentList from './AttachmentList';
import ImportFileOpener from './ImportFileOpener';


const CategoryItem = ({ category, attachments, name, ...rest }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
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
          <ImportFileOpener {...rest} category={category} name={name}>
            <Button
              icon="plus"
              minimal
              text={t(`CRUD.details.attachment.add.${name}`)}
            />
          </ImportFileOpener>
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
