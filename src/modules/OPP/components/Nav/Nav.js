import React from 'react';

import {
  Tooltip,
  Position,
  Button,
} from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import iconPoi from '../../images/icon_poi.svg';
import logo from '../../images/logo_DEAL.png';

import './nav.scss';

export const Nav = ({ t }) => (
  <>
    <div className="navbar__mainMenu">
      <ul>
        <li>
          <Tooltip
            content={t('opp.nav.viewpoints')}
            position={Position.LEFT}
            usePortal={false}
          >
            <NavLink
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
              to="/opp/compaign"
            >
              <Button>
                <img src={iconPoi} alt={t('opp.nav.compaign')} />
              </Button>
            </NavLink>
          </Tooltip>
        </li>
      </ul>
    </div>
    <div className="navbar__logo">
      <NavLink
        exact
        to="/opp/viewpoints"
      >
        <img src={logo} className="logo" alt="" />;
      </NavLink>
    </div>
  </>

);

export default withTranslation()(Nav);
