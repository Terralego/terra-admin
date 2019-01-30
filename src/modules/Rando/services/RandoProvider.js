import React from 'react';
import connect from 'mc-tf-test/utils/connect';

export const context = React.createContext({});
export const connectRandoProvider = connect(context);

const { Provider } = context;

export class RandoProvider extends React.Component {
  state = {

  };

  render () {
    const { children } = this.props;
    const value = {
      ...this.state,
    };
    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default RandoProvider;
