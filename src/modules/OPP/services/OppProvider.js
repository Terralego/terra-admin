
import React from 'react';
import connect from 'mc-tf-test/utils/connect';

import data from './mock.json';

export const context = React.createContext();
export const connectOppProvider = connect(context);

const { Provider } = context;

export class OppProvider extends React.Component {
  state = { viewpoints: data.results }

  getViewpoint = id => {
    const { viewpoints } = this.state;

    return viewpoints.find(({ id: vId }) => vId === +id);
  }

  render () {
    const { children } = this.props;
    const { getViewpoint } = this;
    const value = {
      ...this.state,
      getViewpoint,
    };

    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default OppProvider;
