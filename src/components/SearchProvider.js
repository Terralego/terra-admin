import searchService from '@terralego/core/modules/Visualizer/services/search';
import PropTypes from 'prop-types';

/**
 * Set host to elasticsearch client
 */
export const SearchProvider = ({ children, host }) => {
  let realHost = host;
  if (!host.startsWith('http')) {
    realHost = `${window.location.origin}${host}`;
  }
  searchService.host = realHost;
  return children;
};

SearchProvider.propTypes = {
  children: PropTypes.element.isRequired,
  host:  PropTypes.string.isRequired,
};

export default SearchProvider;
