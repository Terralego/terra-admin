import React from 'react';
import PropTypes from 'prop-types';
import DownloadButtons from '../DownloadButtons';

const Header = ({ title, documents }) => (
  <div className="details__header">
    <h2 className="details__title">{title}</h2>
    {documents && (
      <DownloadButtons
        documents={documents}
      />
    )}
  </div>
);

Header.propTypes = {
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
  documents: undefined,
};

export default Header;
