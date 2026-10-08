import React from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { AppBar, useGetResourceLabel, useTranslate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

import { AppContext } from '../../AppProvider';
import UserDropdown from '../../../views/Main/UserDropdown';
import LangDropdown from '../../../views/Main/LangDropdown';

const useStyles = makeStyles({
  breadcrumb: {
    flex: 1,
    minWidth: 0,
    color: 'inherit',
    fontSize: 16,
  },
  breadcrumbList: {
    flexWrap: 'nowrap',
  },
  crumb: {
    color: 'inherit',
    whiteSpace: 'nowrap',
  },
  // Leaf crumb: filled through a portal by the <Title> of the current page
  title: {
    fontSize: 16,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // Logo + heading, centered on the bar whatever the breadcrumb length.
  // The MuiAppBar root is `position: fixed`, so it is the positioning context.
  brand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
  },
  // Mirrors the former Blueprint navbar heading (.bp3-navbar-heading)
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '2em',
    fontSize: 16,
    fontWeight: 600,
    color: 'inherit',
    textDecoration: 'none',
  },
  logoImage: {
    height: '100%',
  },
  heading: {
    marginLeft: 15,
  },
  menus: {
    display: 'flex',
    alignItems: 'center',
  },
});

/**
 * Dashboard > Layers > My layer, each crumb but the last one clickable.
 *
 * Only the prefix is derived from the route: the leaf is the
 * `#react-admin-title` portal, already filled by the <Title> of the current
 * page — the list label on a list, the record name on a record (RecordTitle).
 * That is what keeps the breadcrumb free of any per-view wiring.
 */
const Breadcrumb = ({ resources }) => {
  const classes = useStyles();
  const location = useLocation();
  const translate = useTranslate();
  const getResourceLabel = useGetResourceLabel();

  // react-admin routes through connected-react-router, whose location is
  // driven by the redux store: it can lag behind on a route that has just been
  // pushed. Degrade to the leaf crumb rather than throwing.
  const pathname = (location && location.pathname) || '';

  const [, name, id] = pathname.split('/');
  // `id` is either a record id or the literal `create`; both hang under the list
  const isResourcePage = !!id && resources.some(resource => resource.name === name);
  const isCreatePage = isResourcePage && id === 'create';

  return (
    <Breadcrumbs
      separator="›"
      aria-label="breadcrumb"
      className={classes.breadcrumb}
      classes={{ ol: classes.breadcrumbList }}
    >
      {pathname !== '/' && (
        <Link component={RouterLink} to="/" className={classes.crumb}>
          {translate('ra.page.dashboard')}
        </Link>
      )}
      {isResourcePage && (
        <Link component={RouterLink} to={`/${name}`} className={classes.crumb}>
          {getResourceLabel(name, 2)}
        </Link>
      )}
      {/*
        On a create page react-admin renders no title at all: <CreateView> goes
        through <TitleForRecord>, which bails out when there is no record. The
        portal target is dropped there — nothing tries to fill it — and the leaf
        is computed here instead.
      */}
      {isCreatePage ? (
        <Typography variant="h6" color="inherit" className={classes.title}>
          {translate('ra.page.create', { name: getResourceLabel(name, 1) })}
        </Typography>
      ) : (
        <Typography
          variant="h6"
          color="inherit"
          className={classes.title}
          id="react-admin-title"
        />
      )}
    </Breadcrumbs>
  );
};

/**
 * Fills the `userMenu` slot of the app bar with the app-level menus.
 * react-admin clones it with a `logout` prop, which they do not need.
 */
const AppBarMenus = () => {
  const classes = useStyles();

  return (
    <div className={classes.menus}>
      <LangDropdown />
      <UserDropdown />
    </div>
  );
};

/**
 * The react-admin AppBar:
 * - left: burger button, then the breadcrumb;
 * - center: logo and heading;
 * - right: language and user menus.
 *
 * Note: as soon as `children` are given, react-admin stops rendering its own
 * title. The `#react-admin-title` node inside the breadcrumb is the portal
 * target used by the `<Title>` of every page, so it must stay.
 */
export const RAAppBar = ({ resources = [], ...props }) => {
  const classes = useStyles();
  const {
    env: {
      title: appTitle,
      theme: { logo: { src, alt = appTitle } = {}, heading } = {},
    } = {},
  } = React.useContext(AppContext);

  return (
    <AppBar {...props} userMenu={<AppBarMenus />}>
      <Breadcrumb resources={resources} />

      <div className={classes.brand}>
        <NavLink to="/" className={classes.logo}>
          {src
            ? <img className={classes.logoImage} src={src} alt={alt} />
            : <span>{alt}</span>}
        </NavLink>
        {heading && (
          // eslint-disable-next-line react/no-danger
          <div className={classes.heading} dangerouslySetInnerHTML={{ __html: heading }} />
        )}
      </div>
    </AppBar>
  );
};

export default RAAppBar;
