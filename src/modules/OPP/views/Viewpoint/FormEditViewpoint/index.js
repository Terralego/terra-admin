import React from 'react';
import {
  Elevation,
  Card,
  H3,
} from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import './formeditviewpoint.scss';
import EditMetadata from './EditMetadata';
import AddPicture from './AddPicture';


export const FormEditViewpoint = ({
  viewpoint,
  t,
  editViewpoint,
  addImageToViewpoint,
}) => (
  <>
    <EditMetadata
      viewpoint={viewpoint}
      editViewpoint={editViewpoint}
    />
    <AddPicture
      viewpoint={viewpoint}
      addImageToViewpoint={addImageToViewpoint}
    />
    <H3>{t('opp.viewpoint.edit.visualization_pictures')}</H3>
    <div className="visu-edit">
      {viewpoint.pictures.map(picture => (
        <Card elevation={Elevation.TWO} key={picture.date}>
          <img src={picture.file.thumbnail} alt={viewpoint.label} />
          <p>{new Date(picture.date).toDateString()}</p>
        </Card>
      ))}
    </div>
  </>
);

export default withNamespaces()(FormEditViewpoint);
