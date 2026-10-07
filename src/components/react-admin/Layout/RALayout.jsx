import React from 'react';
import { Layout } from 'react-admin';

import RAAppBar from './RAAppBar';
import RAMenu from './RAMenu';

/**
 * The standard react-admin layout, with:
 * - an AppBar hosting the app-level menus (see RAAppBar)
 * - a sidebar menu grouping resources by section (see RAMenu)
 *
 * `menu` and `resources` are forwarded by <Admin layout={...}> in RA.js.
 */
export const RALayout = ({ menu, resources, ...props }) => {
  const Menu = React.useMemo(
    () => menuProps => <RAMenu {...menuProps} menu={menu} resources={resources} />,
    [menu, resources],
  );

  // The app bar needs the resource list too, to tell a record page apart from
  // any other route when building the breadcrumb.
  const Bar = React.useMemo(
    () => barProps => <RAAppBar {...barProps} resources={resources} />,
    [resources],
  );

  return (
    <Layout
      {...props}
      appBar={Bar}
      menu={Menu}
    />
  );
};

export default RALayout;
