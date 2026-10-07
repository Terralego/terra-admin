import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardMenuItem, MenuItemLink, useToggleSidebar } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import ViewListIcon from '@material-ui/icons/ViewList';
/* eslint-enable */

import useMenuSections from '../../../hooks/useMenuSections';

const MENU_WIDTH = 240;
const CLOSED_MENU_WIDTH = 55;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(2),
    marginBottom: '1em',
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(1),
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  open: {
    width: MENU_WIDTH,
  },
  closed: {
    width: CLOSED_MENU_WIDTH,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
    color: theme.palette.text.secondary,
  },
  sectionIcon: {
    minWidth: 40,
  },
  sectionItems: {
    paddingLeft: theme.spacing(1),
  },
  // Overrides MenuItemLink's `active` class, which only dims the colour
  activeItem: {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.palette.action.selected,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    // MuiMenuItem pads 16px; compensate the border to keep labels aligned
    paddingLeft: 13,
  },
}));

/**
 * A react-admin `<Menu>` displaying resources grouped by section.
 *
 * react-admin 3 has no multi-level menu: its default `<Menu>` renders every
 * resource as a flat list. The sections come from `config.menu` of the RA
 * module, which is passed down by `<RALayout>`.
 */
export const RAMenu = ({
  menu = [],
  resources = [],
  hasDashboard,
  // injected by react-admin's <Layout>, not meant to reach the DOM
  logout,
  ...props
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [sidebarIsOpen] = useToggleSidebar();
  const [collapsed, setCollapsed] = React.useState({});
  const { sections } = useMenuSections(menu, resources);

  const toggleSection = React.useCallback(
    label => setCollapsed(previous => ({ ...previous, [label]: !previous[label] })),
    [],
  );

  const menuItemClasses = React.useMemo(
    () => ({ active: classes.activeItem }),
    [classes.activeItem],
  );

  const renderItem = React.useCallback(({ href, label, icon: Icon }) => (
    <MenuItemLink
      key={href}
      classes={menuItemClasses}
      to={{ pathname: href, state: { _scrollToTop: true } }}
      primaryText={t(label)}
      leftIcon={Icon ? <Icon /> : <ViewListIcon />}
      sidebarIsOpen={sidebarIsOpen}
    />
  ), [menuItemClasses, sidebarIsOpen, t]);

  const className = `${classes.root} ${sidebarIsOpen ? classes.open : classes.closed}`;

  // Collapsed sidebar is icon-only: section headings would not fit, so the
  // items are flattened and rely on the MenuItemLink tooltips.
  if (!sidebarIsOpen) {
    return (
      <div className={className} {...props}>
        {hasDashboard && <DashboardMenuItem sidebarIsOpen={sidebarIsOpen} />}
        {sections.map(({ items }) => items.map(renderItem))}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {hasDashboard && <DashboardMenuItem sidebarIsOpen={sidebarIsOpen} />}
      {sections.map(({ label, items }) => {
        const open = !collapsed[label];
        return (
          <React.Fragment key={label}>
            <ListItem
              button
              dense
              className={classes.section}
              onClick={() => toggleSection(label)}
            >
              <ListItemIcon className={classes.sectionIcon}>
                <FolderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={t(label)}
                primaryTypographyProps={{ variant: 'overline' }}
              />
              {open
                ? <ExpandLess fontSize="small" color="disabled" />
                : <ExpandMore fontSize="small" color="disabled" />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className={classes.sectionItems}>
                {items.map(renderItem)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RAMenu;
