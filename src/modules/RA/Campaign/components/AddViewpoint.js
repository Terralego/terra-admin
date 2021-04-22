import React, { useState, useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

import { useTranslate } from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';

import { remove } from 'diacritics';
import SuperTable from './SuperTable';
import { RES_VIEWPOINT } from '../../ra-modules';
import { useGetListAllPages } from '../../../../utils/react-admin/hooks';

const useStyles = makeStyles({
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: '1024px',
    backgroundColor: 'white',
    padding: '2em',
    '& .actions': {
      paddingBottom: '2em',
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
});

const normalizeText = text => (text ? remove(text.toLowerCase()) : '');

const ViewpointModal = ({ show, setShow, onAdd, ids }) => {
  const translate = useTranslate();
  const classes = useStyles();

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');

  const { data: viewpointData, isLoading } = useGetListAllPages(RES_VIEWPOINT, 100);

  const handleAdd = useCallback(() => {
    onAdd(selected);
    setSelected([]);
    setShow(false);
  }, [onAdd, selected, setShow]);

  const headCells = React.useMemo(
    () => [
      { id: 'id', numeric: true, disablePadding: false, label: '#' },
      {
        id: 'label',
        numeric: false,
        disablePadding: false,
        label: translate('resources.viewpoint.fields.label'),
      },
      {
        id: 'city',
        numeric: false,
        disablePadding: false,
        label: translate('resources.viewpoint.fields.city'),
      },
      {
        id: 'last_accepted_picture_date',
        numeric: false,
        disablePadding: false,
        renderer: date => new Date(date).toLocaleDateString(),
        label: translate('resources.viewpoint.fields.last_accepted_picture_date'),
      },
    ],
    [translate],
  );

  const filteredViewpoints = React.useMemo(() => {
    const s = normalizeText(search);
    return viewpointData
      .filter(vp => !ids.includes(vp.id))
      .filter(
        ({ label, city, id }) =>
          normalizeText(label).includes(s) || normalizeText(city).includes(s) || `${id}`.includes(s),
      );
  }, [ids, search, viewpointData]);

  const onSearchChange = React.useCallback(e => {
    setSearch(e.target.value);
  }, []);

  return (
    <Modal open={show}>
      <div className={classes.modal}>
        <TextField
          value={search}
          onChange={onSearchChange}
          placeholder={`${translate('ra.action.search')}…`}
          variant="filled"
        />
        {!isLoading && (
          <SuperTable
            title={translate('ra.nav.viewpoint_list')}
            data={filteredViewpoints}
            headCells={headCells}
            selected={selected}
            setSelected={setSelected}
          />
        )}
        {isLoading && <p>{translate('common.loading')}</p>}

        <div className="actions">
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={() => setShow(false)}
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
      </div>
    </Modal>
  );
};

const AddViewpoint = ({ ids = [], onAdd }) => {
  const translate = useTranslate();

  const [showModal, setShowModal] = useState(false);

  const showModalOnclick = useCallback(() => setShowModal(true), []);

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
      <ViewpointModal show={showModal} setShow={setShowModal} onAdd={onAdd} ids={ids} />
    </>
  );
};

export default AddViewpoint;
