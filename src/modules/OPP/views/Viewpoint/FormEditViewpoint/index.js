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
  fetchViewpointPut,
  fetchViewpointPutFormData,
}) => (
  <>
    <EditMetadata
      viewpoint={viewpoint}
      fetchViewpointPut={fetchViewpointPut}
    />
    <AddPicture
      viewpoint={viewpoint}
      fetchViewpointPutFormData={fetchViewpointPutFormData}
    />
    <H3>{t('opp.title.visualizationForm')}</H3>
    <div className="visu-edit">
      {viewpoint.pictures.map(picture => (
        <Card elevation={Elevation.TWO} key={picture.date}>
          <img src={picture.file.thumbnail} alt={viewpoint.label} />
          <p>{String(new Date(picture.date).toDateString())}</p>
        </Card>
      ))}
    </div>
  </>
);

export default withNamespaces()(FormEditViewpoint);
