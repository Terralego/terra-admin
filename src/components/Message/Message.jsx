import React from 'react';
import { Callout } from '@blueprintjs/core';

const Message = ({ intent = 'warning', children, ...props }) => !!children && (
  <Callout intent={intent} {...props}>
    {children}
  </Callout>
);

export default Message;
