import React from 'react';

import { ArrayInput, SimpleFormIterator, useTranslate } from 'react-admin';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from '@material-ui/core';

import { Delete } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import JSONInput from '../../../../../../components/react-admin/JSONInput';
import WidgetCard from './WidgetCard';

const WidgetsTab = ({ source }) => {
  const translate = useTranslate();

  return (
    <>
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
      <Accordion style={{ marginTop: '5em' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {translate('resources.datalayer.widgets-editor.json-editor')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <JSONInput
            source="settings.widgets"
            label="resources.datalayer.fields.settings-widgets"
            fullWidth
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default WidgetsTab;
