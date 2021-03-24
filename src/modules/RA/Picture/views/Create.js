import React from 'react';
import { Create } from 'react-admin';

import PictureFields from '../components/PictureFields';
import DefaultActions from '../../../../components/react-admin/DefaultActions';


export const PictureCreate = props => {
  const { location: { state: { redirect = 'list' } = {} } } = props;

  return (
    <Create
      {...props}
      actions={<DefaultActions redirect={redirect} />}
    >
      <PictureFields redirect={redirect} />
    </Create>
  );
};


export default PictureCreate;
