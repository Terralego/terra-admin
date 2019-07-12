import React, { createElement } from 'react';
import { Notification } from 'react-admin';

export const RALayout = ({ children }) => (
  <>
    {createElement(Notification)}
    {children}
  </>
);

export default RALayout;
