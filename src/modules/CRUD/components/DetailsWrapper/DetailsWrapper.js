import React from 'react';
import classnames from 'classnames';

class DetailsWrapper extends React.Component {
  state = {
    childrenHasLoaded: false,
    full: false,
  }

  hasLoaded = () => this.setState({ childrenHasLoaded: true })

  onSizeChange = () => {
    const { full } = this.state;
    this.setState({ full: !full });
  }

  render () {
    const { children, detailsRef } = this.props;
    const { childrenHasLoaded, full } = this.state;


    return (
      <div
        ref={detailsRef}
        className={
        classnames(
          'CRUD-details',
          { 'CRUD-details--active': children && childrenHasLoaded },
          { 'CRUD-details--full': full },
        )
}
      >
        {children && React.Children.map(children, child => React.cloneElement(child, {
          detailsHasLoaded: () => this.hasLoaded(),
          onSizeChange: () => this.onSizeChange(),
          full,
        }))}
      </div>
    );
  }
}

export default DetailsWrapper;
