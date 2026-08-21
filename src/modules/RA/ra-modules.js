// import { ListGuesser, EditGuesser } from 'react-admin';
import Api from '@terralego/core/modules/Api';
/* eslint-disable import/no-extraneous-dependencies */
import CollectionsIcon from '@material-ui/icons/CollectionsOutlined';
import AppsIcon from '@material-ui/icons/AppsOutlined';
import EventIcon from '@material-ui/icons/EventOutlined';
import GroupIcon from '@material-ui/icons/GroupOutlined';
import LayersIcon from '@material-ui/icons/LayersOutlined';
import LocalOfferIcon from '@material-ui/icons/LocalOfferOutlined';
import LocationCityIcon from '@material-ui/icons/LocationCityOutlined';
import MapIcon from '@material-ui/icons/MapOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import PhotoCameraIcon from '@material-ui/icons/PhotoCameraOutlined';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';
import StorageIcon from '@material-ui/icons/StorageOutlined';
/* eslint-enable */

// User
import userViews from './User/views';
import userGroupViews from './UserGroup/views';

// Icon
import iconViews from './Icon/views';

// Visu
import dataSourceViews from './DataSource/views';
import dataLayerViews from './DataLayer/views';
import sceneViews from './Scene/views';
import baseLayerViews from './BaseLayer/views';

// OPP
import viewpointViews from './Viewpoint/views';
import pictureViews from './Picture/views';
import campaignViews from './Campaign/views';
import themeViews from './ViewpointTheme/views';
import cityViews from './ViewpointCity/views';

// const guessers = {
//   edit: EditGuesser,
//   list: ListGuesser,
// };

// Base map
export const RES_BASELAYER = 'baselayer';

// User
export const RES_USER = 'user';
export const RES_USERGROUP = 'usergroup';
export const RES_PERMISSION = 'permissions';

// Icon
export const RES_ICON = 'icon';

// Visu
export const RES_EXTENT = 'extent';
export const RES_DATASOURCE = 'datasource';
export const RES_DATALAYER = 'datalayer';
export const RES_VIEW = 'view';

// OPP
export const RES_VIEWPOINT = 'viewpoint';
export const RES_PICTURE = 'picture';
export const RES_CAMPAIGN = 'campaign';
export const RES_CITY = 'city';
export const RES_THEME = 'theme';

/**
 * One icon per resource, used by the sidebar, the dashboard tiles and the
 * filter sidebars — so a resource always looks the same wherever it shows up.
 */
export const RESOURCE_ICONS = {
  [RES_USER]: PersonIcon,
  [RES_USERGROUP]: GroupIcon,
  [RES_ICON]: AppsIcon,
  [RES_DATASOURCE]: StorageIcon,
  [RES_DATALAYER]: LayersIcon,
  [RES_VIEW]: CollectionsIcon,
  [RES_BASELAYER]: MapIcon,
  [RES_VIEWPOINT]: PlaceIcon,
  [RES_PICTURE]: PhotoCameraIcon,
  [RES_CAMPAIGN]: EventIcon,
  [RES_CITY]: LocationCityIcon,
  [RES_THEME]: LocalOfferIcon,
};

export const resources = [
  {
    name: RES_USER,
    icon: RESOURCE_ICONS[RES_USER],
    moduleName: 'User',
    // requiredPermissions: 'auth.change_group',
    endpoint: 'user',
    ...userViews,
  },
  {
    name: RES_PERMISSION,
    icon: RESOURCE_ICONS[RES_PERMISSION],
    moduleName: 'User',
    endpoint: 'permissions',
  },
  {
    name: RES_USERGROUP,
    icon: RESOURCE_ICONS[RES_USERGROUP],
    moduleName: 'User',
    // requiredPermissions: 'auth.change_group',
    endpoint: 'groups',
    ...userGroupViews,
  },
  {
    name: RES_ICON,
    icon: RESOURCE_ICONS[RES_ICON],
    // Let the user edit the icons if they can edit the layers
    moduleName: 'DataLayer',
    endpoint: 'icon',
    ...iconViews,
  },
  {
    name: RES_DATASOURCE,
    icon: RESOURCE_ICONS[RES_DATASOURCE],
    moduleName: 'DataSource',
    endpoint: 'geosource',
    ...dataSourceViews,
  },
  {
    name: RES_DATALAYER,
    icon: RESOURCE_ICONS[RES_DATALAYER],
    moduleName: 'DataLayer',
    endpoint: 'geolayer',
    ...dataLayerViews,
  },
  {
    name: RES_VIEW,
    icon: RESOURCE_ICONS[RES_VIEW],
    moduleName: 'DataLayer',
    endpoint: 'geolayer/scene',
    ...sceneViews,
  },
  {
    // read-only, no views
    name: RES_EXTENT,
    moduleName: 'DataLayer',
    endpoint: 'extent',
  },
  {
    name: RES_VIEWPOINT,
    icon: RESOURCE_ICONS[RES_VIEWPOINT],
    moduleName: 'OPP',
    endpoint: 'viewpoints',
    ...viewpointViews,
  },
  {
    name: RES_PICTURE,
    icon: RESOURCE_ICONS[RES_PICTURE],
    moduleName: 'OPP',
    endpoint: 'pictures',
    ...pictureViews,
  },
  {
    name: RES_CAMPAIGN,
    icon: RESOURCE_ICONS[RES_CAMPAIGN],
    moduleName: 'OPP',
    endpoint: 'campaigns',
    ...campaignViews,
  },
  {
    name: RES_CITY,
    icon: RESOURCE_ICONS[RES_CITY],
    moduleName: 'OPP',
    endpoint: 'cities',
    requiredPermissions: 'can_manage_viewpoints',
    ...cityViews,
  },
  {
    name: RES_THEME,
    icon: RESOURCE_ICONS[RES_THEME],
    moduleName: 'OPP',
    endpoint: 'themes',
    requiredPermissions: 'can_manage_viewpoints',
    ...themeViews,
  },
  {
    name: RES_BASELAYER,
    icon: RESOURCE_ICONS[RES_BASELAYER],
    moduleName: 'BaseLayer',
    ...baseLayerViews,
    endpoint: 'baselayer',
  },
];

const byModule = (...modules) => ({ moduleName, list }) => list && modules.includes(moduleName);
const byName = (...names) => ({ name, list }) => list && names.includes(name);

const toItems = list => list.map(({ name, requiredPermissions, beta }) => ({
  label: `ra.nav.${name}_list`,
  href: `/${name}`,
  requiredPermissions,
  beta,
}));

export const config = {
  // path used by router to define when to display current module.
  // '/' is included so that <Admin> also owns the home page and renders its
  // dashboard within the layout (app bar + sidebar). Keep it an array: a plain
  // string would be picked up as `defaultRoute` by Content and redirect '/'
  // onto itself.
  path: ['/', ...resources.map(({ name }) => `/${name}`)],
  menu: [
    {
      label: 'datalayer.project',
      requiredModule: 'DataSource',
      // Icons are grouped with the base layers, not with the layers
      items: toItems(resources
        .filter(byModule('DataSource', 'DataLayer'))
        .filter(({ name }) => name !== RES_ICON)),
    },
    {
      label: 'library.project',
      requiredModule: 'BaseLayer',
      items: toItems(resources.filter(byName(RES_BASELAYER, RES_ICON))),
    },
    {
      label: 'opp.project',
      requiredModule: 'OPP',
      items: toItems(resources.filter(byModule('OPP'))),
    },
    {
      label: 'user.project',
      requiredModule: 'User',
      items: toItems(resources.filter(byModule('User'))),
    },
  ],
};

export const fetchFilterOptions = () => Api.request('viewpoints/filters/');

export default {
  resources,
  config,
};
