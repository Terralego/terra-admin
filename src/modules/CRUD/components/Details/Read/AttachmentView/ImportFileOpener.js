import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Classes, Intent, Overlay } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import ImportFile from './ImportFile';


const CategoryItem = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      {React.Children.map(children, child => (
        React.cloneElement(child, {
          onClick: () => setOpen(true),
        })
      ))}
      <Overlay
        canEscapeKeyClose
        canOutsideClickClose
        className={`${Classes.OVERLAY_SCROLL_CONTAINER} attachmentOverlay`}
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <div className="attachmentOverlay__content">
          <Button
            className="attachmentOverlay__close"
            icon="small-cross"
            intent={Intent.PRIMARY}
            minimal
            onClick={() => setOpen(false)}
            text={t('CRUD.details.close')}
          />
          <ImportFile {...props} setOpen={setOpen} />
        </div>
      </Overlay>
    </>
  );
};

CategoryItem.propTypes = {
  children: PropTypes.element.isRequired,
};

export default CategoryItem;
