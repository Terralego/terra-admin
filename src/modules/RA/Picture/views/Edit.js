import React, { useState } from 'react';
import { Edit } from 'react-admin';
import { withRouter } from 'react-router';

import PictureFields from '../components/PictureFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';
import RecordTitle from '../../../../components/react-admin/RecordTitle';

export const PictureEdit = ({ staticContext, ...props }) => {
  const {
    location: { state: { redirect: redirectProp } = {} },
  } = props;
  const [redirect] = useState(redirectProp);

  return (
    <Edit
      title={<RecordTitle source="label" />}
      {...props}
      mutationMode="pessimistic"
      actions={<DefaultActions redirect={redirect} />}
    >
      <PictureFields redirect={redirect} />
    </Edit>
  );
};

export default withRouter(PictureEdit);
