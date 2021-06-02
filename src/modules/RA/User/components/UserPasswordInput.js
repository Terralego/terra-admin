import React from 'react';

import { Button, TextInput } from 'react-admin';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const UserPasswordInput = props => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <TextInput
        {...props}
        type={show ? 'text' : 'password'}
      />
      <Button
        type="button"
        onClick={() => setShow(!show)}
      >
        {show ? <Visibility /> : <VisibilityOff />}
      </Button>
    </div>
  );
};


export default UserPasswordInput;
