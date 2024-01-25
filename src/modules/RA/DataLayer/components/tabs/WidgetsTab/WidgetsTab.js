import React from 'react';

import {
  ArrayInput,
  RadioButtonGroupInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useInput,
  useTranslate,
} from 'react-admin';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from '@material-ui/core';

import { Delete } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BPIcon, { widgetIcons } from '../../../../../../components/BPIcon';
import Condition from '../../../../../../components/react-admin/Condition';
import JSONInput from '../../../../../../components/react-admin/JSONInput';
import MapBoundingBoxInput from './MapBoundingBoxInput';

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
          <Typography>{translate('resources.datalayer.widgets-editor.json-editor')}</Typography>
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

const WidgetItemInput = ({ source }) => {
  const {
    input: { onChange: onChangeName },
  } = useInput({ source: `${source}.name` });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
        width: '100%',
        '@media (max-width: 600px)': {
          flexDirection: 'column',
        },
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
        label="Type"
        choices={[
          { id: 'sum', name: 'Sum' },
          { id: 'avg', name: 'Average' },
          { id: 'value_count', name: 'Count' },
        ]}
        translateChoice={false}
        helperText={false}
      />
      <TextInput label="resources.datalayer.widgets-editor.field" required source={`${source}.field`} />
      <TextInput
        label="resources.datalayer.widgets-editor.template"
        required
        defaultValue="{{value}}"
        source={`${source}.template`}
      />
    </div>
  );
};

const WidgetCard = ({ source }) => {
  const iconChoices = React.useMemo(
    () =>
      widgetIcons.map(bpIcon => ({
        id: bpIcon,
        name: <BPIcon icon={bpIcon} displayIconName />,
      })),
    [],
  );

  useInput({ source: `${source}.component`, defaultValue: 'synthesis' });

  return (
    <>
      <Card style={{ padding: 15, marginBottom: 15, marginTop: 15 }}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <TextInput required source={`${source}.title`} label="resources.datalayer.widgets-editor.name" />
          <SelectInput
            required
            source={`${source}.icon`}
            label="resources.datalayer.widgets-editor.icon"
            choices={iconChoices}
            translateChoice={false}
            SelectProps={{
              renderValue: value => <BPIcon icon={value} />,
            }}
            style={{
              width: '5em',
              minWidth: '5em',
              marginLeft: 10,
              marginRight: 10,
            }}
          />
          <RadioButtonGroupInput
            required
            source={`${source}.boundingbox_mode`}
            label="resources.datalayer.widgets-editor.bounding-box"
            choices={[
              { id: 'visible', name: 'resources.datalayer.widgets-editor.bounding-box-visible' },
              { id: 'defined', name: 'resources.datalayer.widgets-editor.bounding-box-defined' },
            ]}
            initialValue="visible"
          />
        </div>
        <Condition when={`${source}.boundingbox_mode`} is="defined">
          <MapBoundingBoxInput field={`${source}.boundingbox_value`} />
        </Condition>
        <Divider />
        <CardContent>
          <ArrayInput source={`${source}.items`} label="resources.datalayer.widgets-editor.items">
            <SimpleFormIterator>
              <WidgetItemInput />
            </SimpleFormIterator>
          </ArrayInput>
        </CardContent>
      </Card>
    </>
  );
};

export default WidgetsTab;
