import React from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FormatPaintIcon from '@material-ui/icons/FormatPaint';
import { Field } from 'react-final-form';
import { TextField, TextInput, useTranslate } from 'react-admin';

import { required } from '../../../../utils/react-admin/validate';
import PatternPicker from '../../../../components/react-admin/PatternPicker';
import transparency from './transparency-pattern.png';

const readFile = file => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => { resolve(fr.result); };
  fr.onerror = reject;
  fr.readAsDataURL(file);
});

const isRequired = [required()];

const StyleImageField = ({ source }) => {
  const translate = useTranslate();

  return (
    <Grid container spacing={1} alignItems="center" style={{ minHeight: 60 }}>
      <Field name={`${source}.slug`}>
        {({ input: { value } }) => {
          if (value) {
            return (
              <>
                <Grid item xs={2} style={{ textAlign: 'center' }}>
                  <TextField source={`${source}.name`} />
                </Grid>

                <Grid item xs={2} style={{ textAlign: 'center', opacity: 0.5 }}>
                  <tt>{value}</tt>
                </Grid>
              </>
            );
          }

          return (
            <Grid item xs={4}>
              <TextInput
                source={`${source}.name`}
                label="datalayer.form.style-images.name"
                validate={isRequired}
                fullWidth
              />
            </Grid>
          );
        }}
      </Field>

      <Grid item>
        <Field name={`${source}.file`}>
          {({ input: { value: existingFile } }) => {
            if (existingFile) {
              return (
                <Box
                  component="img"
                  src={existingFile}
                  style={{
                    maxWidth: 64,
                    maxHeight: 64,
                    background: `url(${transparency})`,
                    border: '1px solid rgba(0 0 0 / 0.25)',
                  }}
                />
              );
            }

            return (
              <Field name={`${source}.data`}>
                {({ input: { value, onChange } }) => (
                  <>
                    {!value && (
                      <>
                        <Button
                          variant="outlined"
                          component="label"
                          endIcon={<AttachFileIcon />}
                        >
                          {translate('datalayer.form.style-images.upload')}
                          <Box
                            component="input"
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
                          {translate('datalayer.form.style-images.compose')}
                        </PatternPicker>
                      </>
                    )}

                    <Button
                      onClick={() => onChange(null)}
                      style={{
                        padding: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src={value}
                        style={{
                          maxWidth: 64,
                          maxHeight: 64,
                          background: `url(${transparency})`,
                          border: '1px solid rgba(0 0 0 / 0.25)',
                        }}
                      />
                    </Button>
                  </>
                )}
              </Field>
            );
          }}
        </Field>
      </Grid>
    </Grid>
  );
};

export default React.memo(StyleImageField);
