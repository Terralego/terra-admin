import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Title,
  useGetList,
  useGetResourceLabel,
  useTranslate,
} from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import ViewListIcon from '@material-ui/icons/ViewList';
/* eslint-enable */

import useMenuSections from '../../../hooks/useMenuSections';
import { reportStatusChoices } from '../DataSource';
import { RES_DATALAYER, RES_DATASOURCE, RESOURCE_ICONS } from '../ra-modules';

// Hoisted: useGetList keys its query on these
const FIVE = { page: 1, perPage: 5 };
const COUNT_ONLY = { page: 1, perPage: 1 };
const BY_NAME = { field: 'name', order: 'ASC' };
const BY_UPDATED = { field: 'updated_at', order: 'DESC' };
const NO_FILTER = {};

const listWithFilter = (resource, filter) => ({
  pathname: `/${resource}`,
  search: `?filter=${encodeURIComponent(JSON.stringify(filter))}`,
});

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  sectionLabel: {
    color: theme.palette.text.secondary,
    display: 'block',
    marginBottom: theme.spacing(1),
  },
  tiles: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
    gridGap: theme.spacing(2),
  },
  card: {
    position: 'relative',
    border: `1px solid ${theme.palette.divider}`,
  },
  tileAction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
  },
  tileIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginBottom: theme.spacing(1.5),
    borderRadius: '50%',
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
  count: {
    lineHeight: 1,
    fontWeight: 500,
  },
  tileLabel: {
    marginTop: theme.spacing(0.5),
  },
  tileCreate: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
  panels: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gridGap: theme.spacing(2),
    alignItems: 'start',
  },
  statuses: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
  },
  status: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 1),
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  statusLabel: {
    textAlign: 'center',
  },
}));

/**
 * One resource: how many records it holds, a shortcut to its list and, when
 * the resource can be created, a shortcut to its creation form.
 *
 * The count is the `total` of a one-item page, so it costs a cheap request.
 */
const CountTile = ({ name, label, href, icon: Icon, hasCreate }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const translate = useTranslate();
  const { total, loaded } = useGetList(name, COUNT_ONLY, BY_NAME, NO_FILTER);

  return (
    <Card elevation={0} className={classes.card}>
      <CardActionArea component={Link} to={href} className={classes.tileAction}>
        <div className={classes.tileIcon}>
          {Icon ? <Icon fontSize="small" /> : <ViewListIcon fontSize="small" />}
        </div>
        <Typography variant="h4" className={classes.count}>
          {loaded ? total : '—'}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.tileLabel}>
          {t(label)}
        </Typography>
      </CardActionArea>
      {hasCreate && (
        <Tooltip title={translate('ra.action.create')}>
          {/* Sibling of the action area, never nested: two anchors cannot be */}
          <IconButton
            size="small"
            component={Link}
            to={`${href}/create`}
            className={classes.tileCreate}
            aria-label={translate('ra.action.create')}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Card>
  );
};

/**
 * The latest records of a resource, most recently updated first.
 *
 * The date is always rendered, never hidden behind a fallback: an empty second
 * line is the signal that the API does not expose `updated_at` there.
 */
const RecentlyUpdated = ({ resource, icon: Icon }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const getResourceLabel = useGetResourceLabel();
  const { data = {}, ids = [], loaded } = useGetList(
    resource,
    FIVE,
    BY_UPDATED,
    NO_FILTER,
  );

  if (!loaded || !ids.length) {
    return null;
  }

  return (
    <Card elevation={0} className={classes.card}>
      <CardHeader
        avatar={Icon ? <Icon color="disabled" /> : null}
        title={getResourceLabel(resource, 2)}
        subheader={translate('dashboard.recently_updated')}
        titleTypographyProps={{ variant: 'subtitle1' }}
      />
      <Divider />
      <List dense disablePadding>
        {ids.map(id => (
          <ListItem button key={id} component={Link} to={`/${resource}/${id}`}>
            <ListItemText
              primary={data[id].name}
              secondary={data[id].updated_at
                ? new Date(data[id].updated_at).toLocaleString()
                : null}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

const StatusCount = ({ id, name }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const filter = React.useMemo(() => ({ report__status: id }), [id]);
  const { total, loaded } = useGetList(RES_DATASOURCE, COUNT_ONLY, BY_NAME, filter);

  return (
    <Link to={listWithFilter(RES_DATASOURCE, filter)} className={classes.status}>
      <Typography variant="h5" className={classes.count}>
        {loaded ? total : '—'}
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        className={classes.statusLabel}
      >
        {translate(name, { _: name })}
      </Typography>
    </Link>
  );
};

/**
 * How data sources split across the outcomes of their last refresh. Each count
 * links to the source list already filtered on that status.
 */
const SourceStatuses = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const Icon = RESOURCE_ICONS[RES_DATASOURCE];

  return (
    <Card elevation={0} className={classes.card}>
      <CardHeader
        avatar={<Icon color="disabled" />}
        title={translate('datasource.form.report.title')}
        titleTypographyProps={{ variant: 'subtitle1' }}
      />
      <Divider />
      <div className={classes.statuses}>
        {reportStatusChoices.map(({ id, name }) => (
          <StatusCount key={id} id={id} name={name} />
        ))}
      </div>
    </Card>
  );
};

/**
 * The `dashboard` of <Admin>, displayed at `/` inside the react-admin layout.
 *
 * Everything here is derived: the tiles come from the very resources declared
 * in ra-modules, and the panels from data the API already exposes. Nothing
 * needs configuring when a resource is added.
 */
export const Dashboard = ({ menu = [], resources = [] }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { sections } = useMenuSections(menu, resources);

  const registered = React.useMemo(
    () => new Set(resources.filter(({ list }) => list).map(({ name }) => name)),
    [resources],
  );

  return (
    <div className={classes.root}>
      {/* Leaf crumb of the app bar breadcrumb, which shows no link for `/` */}
      <Title title="ra.page.dashboard" />

      {sections.map(({ label, items }) => (
        <div key={label}>
          <Typography variant="overline" className={classes.sectionLabel}>
            {t(label)}
          </Typography>
          <div className={classes.tiles}>
            {items.map(item => <CountTile key={item.href} {...item} />)}
          </div>
        </div>
      ))}

      <div className={classes.panels}>
        {registered.has(RES_DATALAYER) && (
          <RecentlyUpdated
            resource={RES_DATALAYER}
            icon={RESOURCE_ICONS[RES_DATALAYER]}
          />
        )}
        {registered.has(RES_DATASOURCE) && (
          <RecentlyUpdated
            resource={RES_DATASOURCE}
            icon={RESOURCE_ICONS[RES_DATASOURCE]}
          />
        )}
        {registered.has(RES_DATASOURCE) && <SourceStatuses />}
      </div>
    </div>
  );
};

export default Dashboard;
