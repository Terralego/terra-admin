import React from 'react';
import { Layout } from 'react-admin';

export const RALayout = props => (
  <Layout
    {...props}
    appBar={() => null}
    sidebar={() => null}
    menu={() => null}
    style={{ marginTop: '-48px' }}
  />
);

export default RALayout;
