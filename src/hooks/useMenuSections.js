import React from 'react';

import useUserSettings from './useUserSettings';

const resourceNameFromHref = href => `${href}`.replace(/^\//, '');

/**
 * Turns the `config.menu` tree of a module into the sections displayed by the
 * react-admin sidebar (RAMenu) and dashboard (Dashboard).
 *
 * An entry is kept only if:
 * - its resource is actually registered in <Admin> and has a list view;
 * - the user has the permission it requires.
 *
 * Note that resources are intentionally NOT filtered by permission in RA.js
 * (some are meant to stay reachable read-only), so the permission check has to
 * happen here, exactly like the legacy MenuTree did.
 *
 * @param {Array} menu the `config.menu` tree
 * @param {Array} resources the resources registered in <Admin>
 * @returns {{ sections: Array }}
 */
const useMenuSections = (menu = [], resources = []) => {
  const { hasPermission } = useUserSettings();

  const listable = React.useMemo(
    () => new Map(
      resources
        .filter(({ list }) => list)
        .map(resource => [resource.name, resource]),
    ),
    [resources],
  );

  const sections = React.useMemo(
    () => menu
      .map(({ label, items = [] }) => ({
        label,
        items: items
          .filter(({ href, requiredPermissions }) =>
            listable.has(resourceNameFromHref(href))
            && (!requiredPermissions || hasPermission(requiredPermissions)))
          // Carry what the sidebar and the dashboard need, so neither has to
          // resolve the resource definition again
          .map(item => {
            const name = resourceNameFromHref(item.href);
            const resource = listable.get(name);
            return {
              ...item,
              name,
              icon: resource.icon,
              hasCreate: !!resource.create,
            };
          }),
      }))
      .filter(({ items }) => items.length),
    [menu, listable, hasPermission],
  );

  return { sections };
};

export default useMenuSections;
