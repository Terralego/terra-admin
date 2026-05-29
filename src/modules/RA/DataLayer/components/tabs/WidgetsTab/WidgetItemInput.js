import React from 'react';

import {  NumberInput, SelectInput, TextInput, useInput, useTranslate } from 'react-admin';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WidgetDetailsInputs from './WidgetDetails/WidgetDetailsInputs';

const WIDGET_TYPE_CHOICES = [
  { id: 'sum', name: 'resources.datalayer.widgets-editor.type-value.sum' },
  { id: 'avg', name: 'resources.datalayer.widgets-editor.type-value.avg' },
  { id: 'value_count', name: 'resources.datalayer.widgets-editor.type-value.value_count' },
  { id: 'distribution', name: 'resources.datalayer.widgets-editor.type-value.distribution' },
  { id: 'categoric', name: 'resources.datalayer.widgets-editor.type-value.categoric' },
  { id: 'numeric', name: 'resources.datalayer.widgets-editor.type-value.numeric' },
];

const WidgetItemInput = ({ source }) => {
  const translate = useTranslate();

  const {
    input: { value: nameValue, onChange: onChangeName },
  } = useInput({ source: `${source}.name` });

  const {
    input: { value: typeValue },
  } = useInput({ source: `${source}.type` });

  const typeValuePrettyName = translate(
    WIDGET_TYPE_CHOICES.find(c => c.id === typeValue)?.name,
    { _: typeValue },
  );

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} style={{ marginTop: 5, marginBottom: 5 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography style={{ fontWeight: 'bold' }}>{nameValue} ({typeValuePrettyName})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5em',
              flexWrap: 'wrap',
              flexShrink: 1,
            }}
          >
            <TextInput
              required
              label="resources.datalayer.widgets-editor.label"
              source={`${source}.label`}
              onChange={e => onChangeName(e.target.value)}
            />
            <SelectInput
              required
              source={`${source}.type`}
              label="resources.datalayer.widgets-editor.type"
              choices={WIDGET_TYPE_CHOICES}
              helperText={false}
            />
            <NumberInput
              label="resources.datalayer.widgets-editor.decimals"
              source={`${source}.decimals`}
            />
          </div>
          <div style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Card>
              <CardContent>
                <Typography gutterBottom>
                  <span style={{ fontWeight: 'bold' }}>{typeValuePrettyName}</span>{' '}
                  {translate('resources.datalayer.widgets-editor.settings')}
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1em',
                    width: '100%',
                  }}
                >
                  <WidgetDetailsInputs source={source} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default WidgetItemInput;
