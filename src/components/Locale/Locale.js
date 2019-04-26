import React from 'react';

import i18n from '../../config/i18n';

export class Locale extends React.Component {
  componentDidMount () {
    i18n.on('languageChanged', this.languageChangedListener = () => this.forceUpdate());
  }

  componentWillUnmount () {
    i18n.off('languageChanged', this.languageChangedListener);
  }

  render () {
    const { children } = this.props;

    return children(i18n.language);
  }
}

export default Locale;
