import React from 'react';

import {
  Tooltip,
  Position,
  Button,
} from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import iconPoi from './images/icon_poi.svg';
import iconCampaign from './images/no_photo.png';

import './nav.scss';

export const Nav = ({ t }) => (
  <ul className="navbar__mainMenu">
    <li>
      <Tooltip
        content={t('opp.nav.viewpoints')}
        position={Position.LEFT}
        usePortal={false}
      >
        <NavLink
          exact
          to="/opp/viewpoints"
        >
          <Button>
            <img src={iconPoi} alt={t('opp.nav.viewpoints')} />
          </Button>
        </NavLink>
      </Tooltip>
    </li>
    <li>
      <Tooltip
        content={t('opp.nav.compaign')}
        position={Position.LEFT}
        usePortal={false}
      >
        <NavLink
          exact
          to="/opp/compaign"
        >
          <Button>
            <img src={iconPoi} alt={t('opp.nav.compaign')} />
          </Button>
        </NavLink>
      </Tooltip>
    </li>
  </ul>
);

export default withNamespaces()(Nav);
