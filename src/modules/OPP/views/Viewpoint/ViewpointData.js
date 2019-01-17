import React from 'react';
import { ControlGroup, Classes } from '@blueprintjs/core';

export const ViewpointData = viewpoint => (
  <>
    <h3>
      Label
    </h3>
    <p>
      {viewpoint.label}
    </p>
    <h3>
      ID
    </h3>
    <p>
      {viewpoint.id}
    </p>
    <p>
      <ControlGroup>
        <input className={Classes.INPUT} placeholder={viewpoint.id} />
      </ControlGroup>
    </p>
    <h3>
      Les images
    </h3>
    <ul>
      <li><img src={viewpoint.picture.thumbnail} alt="" /> <br /> thumbnail : {viewpoint.picture.thumbnail} </li>
      <li><img src={viewpoint.picture.list} alt="" /> <br /> list : {viewpoint.picture.list}</li>
      <li><img src={viewpoint.picture.full} alt="" /> <br /> full : {viewpoint.picture.full}</li>
      <li><img src={viewpoint.picture.original} alt="" /> <br /> original : {viewpoint.picture.original}</li>
    </ul>
    <h3>
      Géométrie
    </h3>
    <p>
      type : {viewpoint.geometry.type}
    </p>
    <ul>
      {viewpoint.geometry.coordinates.map(elem => (
        <li key={elem}>
          {elem}
        </li>
      ))}
    </ul>
    <p>
      Status : {viewpoint.status}
    </p>

  </>
);

export default ViewpointData;
