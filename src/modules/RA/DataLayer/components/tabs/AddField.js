import React, { useState, useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FieldOption from './FieldOption';

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

const AddField = ({ fields, onAdd, textContent, iconOnly, variant }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [showModal, setShowModal] = useState(false);

  const showModalOnclick = useCallback(() => setShowModal(true), []);

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedTarget = formData.get('selected');
    onAdd(Number(selectedTarget));
    setShowModal(false);
  }, [onAdd]);

  const handleReset = useCallback(event => {
    event.preventDefault();
    setShowModal(false);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        onClick={showModalOnclick}
        label="datalayer.form.popup.add-field"
        startIcon={<AddIcon aria-label={iconOnly ? translate(textContent.addField) : ''} />}
      >
        {!iconOnly && translate(textContent.addField)}
      </Button>
      <Modal open={showModal}>
        <form className={classes.modal} onSubmit={handleSubmit} onReset={handleReset}>
          <div className={classes.fieldSelect}>

            <Select name="selected" required style={{ width: '80%' }}>
              <MenuItem value="">{translate(textContent.selectField)}</MenuItem>
              {fields.map(f => (
                <MenuItem
                  key={f.sourceFieldId}
                  value={f.sourceFieldId}
                >
                  <FieldOption record={
                      {
                        label: f.label || f.name,
                        name: f.name,
                        dataType: f.data_type,
                      }
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={classes.modalButtons}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              type="reset"
            >
              {translate(textContent.cancel)}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              type="submit"
            >
              {translate(textContent.add)}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddField;
