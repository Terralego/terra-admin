import React from 'react';
import {
  Elevation,
  Card,
  H3,
} from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import EditMetadata from './EditMetadata';
import AddPicture from './AddPicture';
import { dateFormat } from '../../../../../utils/date';

import './formeditviewpoint.scss';

export const FormEditViewpoint = ({
  viewpoint,
  t,
  saveViewpointAction,
  uploadPictureViewpointAction,
}) => (
  <>
    <EditMetadata
      viewpoint={viewpoint}
      saveViewpointAction={saveViewpointAction}
    />
    <AddPicture
      viewpoint={viewpoint}
      uploadPictureViewpointAction={uploadPictureViewpointAction}
    />
    <H3>{t('opp.viewpoint.edit.visualization-pictures')}</H3>
    <div className="visu-edit">
      {viewpoint.pictures.map(picture => (
        <Card elevation={Elevation.TWO} key={picture.id}>
          <img src={picture.file.thumbnail} alt={viewpoint.label} />
          <p>{dateFormat(picture.date)}</p>
        </Card>
      ))}
    </div>
  </>
);

export default withNamespaces()(FormEditViewpoint);
