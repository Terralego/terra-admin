import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import FitBoundButton from '../FitBoundButton';
import DownloadButtons from '../DownloadButtons';

const Header = ({ className, documents, title, ...props }) => (
  <header className={classnames('details__header', className)} {...props}>
    <div className="details__header-title">
      <FitBoundButton title={title} />
      <h2 className="details__title">{title}</h2>
    </div>
    {documents && (
      <DownloadButtons
        documents={documents}
      />
    )}
  </header>
);

Header.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      template_name: PropTypes.string,
      download_url: PropTypes.string,
      template_file: PropTypes.string,
    }),
  ),
};

Header.defaultProps = {
  className: '',
  documents: undefined,
};

export default Header;
