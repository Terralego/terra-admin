import React from 'react';
import { useField } from 'react-final-form';
import { FileInput } from 'react-admin';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';

const RestrictedFileInput = ({ accept, ...props }) => {
  const { t } = useTranslation();
  const [unsupported, setUnsupported] = React.useState(false);
  const { input: { value, onChange } } = useField(props.source);
  const previousValueRef = React.useRef(value);
  previousValueRef.current = value;

  const handleDrop = (newFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      if (newFiles.length === 0) {
        onChange(previousValueRef.current);
      }
      setUnsupported(true);
    } else {
      setUnsupported(false);
    }
  };

  return (
    <>
      <FileInput
        {...props}
        accept={accept}
        options={{ onDrop: handleDrop }}
      />
      {unsupported && (
        <Alert severity="error" style={{ marginBottom: 8 }}>
          {t('datasource.form.file.unsupported')}
        </Alert>
      )}
    </>
  );
};

export default RestrictedFileInput;
