import React from 'react';
import {
  Card,
} from '@blueprintjs/core';
// import { withNamespaces } from 'react-i18next';

import "./viewpoint-list.scss";

//const testImage='https://www.geo.fr/var/geo/storage/images/voyages/vos-voyages-de-reve/martinique-terre-de-relief/grande-anse/597440-1-fre-FR/grande-anse_940x705.jpg'

export const ViewpointListItem = ({ id, label, picture:{list:src} }) => (
  <Card interactive={true}>
    <img src={src} alt="" />
    <h5>{label}</h5>
  </Card>
);

export default ViewpointListItem;