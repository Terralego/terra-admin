import React from 'react';
import PropTypes from 'prop-types';
import { Classes, ControlGroup, Icon, InputGroup } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

const Picture = ({ label, image, thumbnail, ...props }) => {
  const { t } = useTranslation();

  if (!thumbnail) {
    return null;
  }
  return (
    <>
      <div {...props}>
        <img src={thumbnail} alt={label} />
      </div>
      <ControlGroup className="attachment-item__link" fill>
        <InputGroup value={image} readOnly />
        <a
          className={Classes.BUTTON}
          href={image}
          target="_blank"
          rel="noopener noreferrer"
          title={t('CRUD.details.attachment.openImage')}
        >
          <Icon icon="share" />
        </a>
      </ControlGroup>
    </>
  );
};

Picture.propTypes = {
  label: PropTypes.string,
  thumbnail: PropTypes.string,
};

Picture.defaultProps = {
  label: undefined,
  thumbnail: undefined,
};

export default Picture;
