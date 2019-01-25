import React from 'react';
import {
  H2,
} from '@blueprintjs/core';

import FormEditViewpoint from './FormEditViewpoint';
import Loading from '../../../../components/Loading';
import ErrorView from '../../../../views/ErrorView';

export class Viewpoint extends React.Component {
  componentDidMount () {
    const { getViewpointAction, match: { params: { id } } } = this.props;
    getViewpointAction(id);
  }

  componentDidUpdate ({ match: { params: { id: prevId } } }) {
    const { getViewpointAction, match: { params: { id } }, viewpoint } = this.props;
    if (id !== prevId && (!viewpoint || viewpoint.id !== id)) {
      getViewpointAction(id);
    }
  }

  render () {
    const { viewpoint, hasError, codeError } = this.props;

    if (hasError && codeError === 'Not Found') return <ErrorView error={{ code: 404 }} />;

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
