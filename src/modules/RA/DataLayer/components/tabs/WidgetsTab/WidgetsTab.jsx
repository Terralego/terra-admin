import React from 'react';

import { ArrayInput, SimpleFormIterator, useTranslate } from 'react-admin';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Typography,
} from '@material-ui/core';

import { Delete } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { useField } from 'react-final-form';
import JSONInput from '../../../../../../components/react-admin/JSONInput';
import WidgetCard from './WidgetCard';

const WidgetsTab = ({ source, record }) => {
  const translate = useTranslate();

  const {
    input: { onChange: onWidgetsChange },
  } = useField(`${source}.widgets`);

  const displayArrayInput =
    !record.settings || record?.settings?.widgets instanceof Array;

  return (
    <>
      {displayArrayInput ? (
        <Box style={{ marginBottom: '5em' }}>
          <ArrayInput
            source={`${source}.widgets`}
            label="resources.datalayer.fields.settings-widgets"
          >
            <SimpleFormIterator
              disableReordering
              removeButton={(
                <IconButton>
                  <Delete />
                </IconButton>
              )}
            >
              <WidgetCard />
            </SimpleFormIterator>
          </ArrayInput>
        </Box>
      ) : (
        <Alert
          severity="error"
          action={(
            <Button color="inherit" size="small" onClick={() => onWidgetsChange([])}>
              {translate(
                'resources.datalayer.widgets-editor.error-empty-object-action',
              )}
            </Button>
          )}
        >
          {translate('resources.datalayer.widgets-editor.error-empty-object')}
        </Alert>
      )}
      <Accordion defaultExpanded={!displayArrayInput}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {translate('resources.datalayer.widgets-editor.json-editor')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <JSONInput
            source={`${source}.widgets`}
            initialValue={[]}
            label="resources.datalayer.fields.settings-widgets"
            fullWidth
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default WidgetsTab;
