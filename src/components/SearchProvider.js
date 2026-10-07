import PropTypes from 'prop-types';
import searchService from '../terra-front/search';

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
