import React from 'react';
import {
  TextInput,
  SimpleForm,
  useTranslate,
  Labeled,
  useInput,
} from 'react-admin';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FormatPaintIcon from '@material-ui/icons/FormatPaint';
import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { Box, Button, FormHelperText } from '@material-ui/core';
import transparency from './transparency-pattern.png';
import PatternPicker from '../../../../components/react-admin/PatternPicker';
import { required } from '../../../../utils/react-admin/validate';


const readFile = file => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => { resolve(fr.result); };
  fr.onerror = reject;
  fr.readAsDataURL(file);
});

function IconsFields (props) {
  return (
    <SimpleForm {...props}>
      <TextInput
        source="name"
        label="icon.form.name"
        required
        validate={[required()]}
      />
      <ImageInput
        source="data"
        label="icon.form.file.label"
      />
    </SimpleForm>
  );
}

function ImageInput ({ source, label }) {
  const translate = useTranslate();


  const {
    input: { value, onChange },
    meta: { error, submitFailed },
  } = useInput({ source, validate: [required()] });

  return (
    <Box>
      <Labeled label={label} />
      <Box display="flex" flexDirection="row" alignItems="center" style={{ gap: 5 }}>
        {value ? (
          <img
            src={value}
            style={{
              width: 64,
              height: 64,
              background: `url(${transparency})`,
              border: '1px solid rgba(0 0 0 / 0.25)',
            }}
            alt=""
          />
        ) : null}
        <Button
          variant="outlined"
          component="label"
          endIcon={<AttachFileIcon />}
        >
          {translate('icon.form.file.upload')}
          <input
            type="file"
            accept="image/*"
            onChange={async event => {
              const [file] = event.target.files;

              if (file) {
                onChange(await readFile(file));
              }
            }}
            hidden
          />
        </Button>
        {' ou '}
        <PatternPicker
          onChange={onChange}
          endIcon={<FormatPaintIcon />}
        >
          {translate('icon.form.file.compose')}
        </PatternPicker>
      </Box>
      {error && submitFailed ?
        <FormHelperText error>{error}</FormHelperText> : null}
    </Box>
  );
}


export default connectAuthProvider('icon')(IconsFields);
