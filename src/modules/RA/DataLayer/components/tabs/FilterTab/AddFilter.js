import React from 'react';

import {
  useTranslate,
} from 'react-admin';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

import Modal from '@material-ui/core/Modal';

import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import { useForm } from 'react-final-form';


const useStyles = makeStyles({
  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: 500,
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


const AddFilter = ({ fields }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();
  const [showAddModal, setShowAddModal] = React.useState(false);

  const [selected, setSelected] = React.useState('');
  const onSelect = React.useCallback(e => {
    setSelected(parseInt(e.target.value, 10));
  }, []);

  const onCloseModal = React.useCallback((addField = false) => {
    if (addField) {
      const { values: { fields: formFields } } = form.getState();
      const newFields = [...formFields];
      form.change('fields', newFields.map(field => {
        if (field.sourceFieldId === selected) {
          return { ...field, filter_enable: true, filter_settings: { type: 'single' } };
        }
        return field;
      }));
    }
    setSelected('');
    setShowAddModal(false);
  }, [form, selected]);

  return (
    <>
      <Button
        color="primary"
        onClick={() => setShowAddModal(true)}
        variant="contained"
        startIcon={<AddIcon />}
      >{translate('ra.action.add')}
      </Button>
      <Modal open={showAddModal} onClose={() => onCloseModal()}>
        <div className={classes.modal}>
          <div className={classes.fieldSelect}>
            <Select
              native
              value={selected}
              onChange={onSelect}
            >
              <option value="">{translate('datalayer.form.filter.select-field')}</option>
              {fields.filter(field => !field.filter_enable).map(field => (
                <option
                  key={field.sourceFieldId}
                  value={field.sourceFieldId}
                >{field.label} ({field.name})
                </option>
              ))}
            </Select>

          </div>

          <div className={classes.modalButtons}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onCloseModal()}
              startIcon={<CancelIcon />}
            >{translate('ra.action.cancel')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onCloseModal(true)}
              startIcon={<AddIcon />}
              disabled={!selected}
            >{translate('ra.action.add')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};


export default AddFilter;
