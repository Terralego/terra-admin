import React, { useState, useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

import { useTranslate, useDataProvider } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import SuperTable from './SuperTable';
import { RES_VIEWPOINT } from '../../ra-modules';

const useStyles = makeStyles({
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: '1024px',
    backgroundColor: 'white',
    padding: '1em',
  },
  modalButtons: {
    marginTop: '1em',
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldSelect: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const AddViewpoint = ({ ids = [], onAdd }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [showModal, setShowModal] = useState(false);

  const [selected, setSelected] = React.useState([]);

  const dataProvider = useDataProvider();
  const [viewpointData, setViewpointData] = React.useState([]);

  const showModalOnclick = useCallback(() => setShowModal(true), []);

  const handleAdd = useCallback(() => {
    onAdd(selected);
    setSelected([]);
    setShowModal(false);
  }, [onAdd, selected]);

  const headCells = React.useMemo(
    () => [
      { id: 'id', numeric: true, disablePadding: false, label: '#' },
      {
        id: 'label',
        numeric: false,
        disablePadding: false,
        label: translate('resources.campaign.fields.label'),
      },
      {
        id: 'photographer',
        numeric: true,
        disablePadding: false,
        label: translate('resources.campaign.fields.assignee'),
      },
    ],
    [translate],
  );

  React.useEffect(() => {
    const loadViewpoints = async () => {
      const { data } = await dataProvider.getList(RES_VIEWPOINT, {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'id' },
        order: 'id',
      });
      setViewpointData(data.filter(vp => !ids.includes(vp.id)));
    };
    loadViewpoints();
  }, [dataProvider, ids]);

  return (
    <>
      <Button
        type="button"
        onClick={showModalOnclick}
        label="datalayer.form.popup.add-field"
        startIcon={<AddIcon aria-label={translate('ra.action.add')} />}
      >
        {translate('ra.action.add')}
      </Button>
      <Modal open={showModal}>
        <div className={classes.modal}>
          <SuperTable
            data={viewpointData}
            headCells={headCells}
            selected={selected}
            setSelected={setSelected}
          />

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={() => setShowModal(false)}
          >
            {translate('ra.action.cancel')}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleAdd(selected)}
          >
            {translate('ra.action.add')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddViewpoint;
