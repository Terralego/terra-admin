import React from 'react';
import classnames from 'classnames';

class DetailsWrapper extends React.Component {
  state = {
    childrenHasLoaded: false,
  }

  hasLoaded = () => this.setState({ childrenHasLoaded: true })

  render () {
    const { children } = this.props;
    const { childrenHasLoaded } = this.state;

    return (
      <div className={classnames('rando-details', { 'rando-details--visible': children && childrenHasLoaded })}>
        {children && React.Children.map(children, child => React.cloneElement(child, {
          detailsHasLoaded: () => this.hasLoaded(),
        }))}
      </div>
    );
  }
}

export default DetailsWrapper;
