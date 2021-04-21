import React from 'react';
import { SaveButton, Confirm, useSaveContext, useNotify } from 'react-admin';


const SaveButtonWithConfirm = ({
  handleSubmitWithRedirect,
  record,
  resource,
  redirect,
  onSuccess,
  onFailure,
  saving,
  invalid,
  transform,
  confirmContent,
  confirmTitle,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const notify = useNotify();
  const { setOnSuccess, setOnFailure, setTransform } = useSaveContext(props);

  const handleClick = React.useCallback(e => {
    if (invalid) {
      notify('ra.message.invalid_form', 'warning');
    }
    if (saving) {
      // prevent double submission
      e.preventDefault();
    }
    setOpen(true);
  }, [invalid, notify, saving]);

  // Not memoized on purpose
  const handleConfirm = () => {
    if (onSuccess) {
      setOnSuccess(onSuccess);
    }
    if (onFailure) {
      setOnFailure(onFailure);
    }
    setTransform(transform);
    handleSubmitWithRedirect(redirect);
  };

  return (
    <>
      <SaveButton {...props} handleSubmitWithRedirect={handleClick} saving={saving} />
      <Confirm
        isOpen={open}
        title={confirmTitle}
        content={confirmContent}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default SaveButtonWithConfirm;
