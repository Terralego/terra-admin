import React, { useState } from 'react';
import { Edit } from 'react-admin';
import { withRouter } from 'react-router';

import PictureFields from '../components/PictureFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';

export const PictureEdit = ({ staticContext, ...props }) => {
  const {
    location: { state: { redirect: redirectProp } = {} },
  } = props;
  const [redirect] = useState(redirectProp);

  return (
    <Edit
      {...props}
      mutationMode="pessimistic"
      actions={<DefaultActions redirect={redirect} />}
    >
      <PictureFields edit redirect={redirect} />
    </Edit>
  );
};

export default withRouter(PictureEdit);
