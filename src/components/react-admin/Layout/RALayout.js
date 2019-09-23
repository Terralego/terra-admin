import React from 'react';
import { Layout } from 'react-admin';

export const RALayout = props => (
  <Layout
    {...props}
    appBar={() => null}
    sidebar={() => null}
    menu={() => null}
  />
);

export default RALayout;
