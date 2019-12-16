import React from 'react';
import { Toolbar, SaveButton, DeleteButton } from 'react-admin';

const DataLayerFormToolbar = React.memo(props => {
  const { record: { group, view } } = props;
  const hasGroup = typeof group === 'number';
  const hasView = typeof view === 'number';
  const canDelete = !hasGroup && !hasView;

  return (
    <Toolbar
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
      {...props}
    >
      <SaveButton submitOnEnter />
      {canDelete && <DeleteButton />}
    </Toolbar>
  );
});

export default DataLayerFormToolbar;
