import React from 'react';
import {
  H2,
} from '@blueprintjs/core';

import FormEditViewpoint from './FormEditViewpoint';
import Loading from '../../../../components/Loading';
import Error404 from '../../../../components/Error404';

export class Viewpoint extends React.Component {
  componentDidMount () {
    const { fetchViewpoint, match: { params: { id } } } = this.props;
    fetchViewpoint(id);
  }

  render () {
    const { viewpoint, hasError } = this.props;

    if (hasError) return <Error404 />;

    if (!viewpoint) return <Loading />;

    return (
      <>
        <div className="page--title">
          <H2>{viewpoint.label}</H2>
        </div>
        <div className="page--content">
          <FormEditViewpoint {...this.props} />
        </div>
      </>
    );
  }
}

export default Viewpoint;
