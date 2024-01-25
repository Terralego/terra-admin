import React from 'react';

import {
  ArrayInput,
  RadioButtonGroupInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useInput,
} from 'react-admin';

import { Card, CardContent, Divider, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import BPIcon, { widgetIcons } from '../../../../../../components/BPIcon';
import Condition from '../../../../../../components/react-admin/Condition';
import MapBoundingBoxInput from './MapBoundingBoxInput';

const WidgetsTab = ({ source }) =>
  (
    <>
      <ArrayInput source={`${source}.widgets`} label="Widgets">
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
    </>
  );

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
        label="Label"
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
      <TextInput label="Field" required source={`${source}.field`} />
      <TextInput
        label="Template"
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
          <TextInput required source={`${source}.title`} label="Name" />
          <SelectInput
            required
            source={`${source}.icon`}
            label="Icon"
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
            label="Bounding box"
            choices={[
              { id: 'visible', name: 'Viewport' },
              { id: 'defined', name: 'Defined value' },
            ]}
            initialValue="visible"
          />
        </div>
        <Condition when={`${source}.boundingbox_mode`} is="defined">
          <MapBoundingBoxInput field={`${source}.boundingbox_value`} />
        </Condition>
        <Divider />
        <CardContent>
          <ArrayInput source={`${source}.items`} label="Items">
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
