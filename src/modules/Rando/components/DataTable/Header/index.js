import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import Header from './Header';

export default withNamespaces()(withRouter(Header));
