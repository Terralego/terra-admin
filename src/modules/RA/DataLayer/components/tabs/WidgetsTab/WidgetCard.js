import React from 'react';

import {
  ArrayInput,
  RadioButtonGroupInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useInput,
} from 'react-admin';

import { Card, CardContent, Divider } from '@material-ui/core';

import BPIcon, { widgetIcons } from '../../../../../../components/BPIcon';
import Condition from '../../../../../../components/react-admin/Condition';
import MapBoundingBoxInput from './MapBoundingBoxInput';
import WidgetItemInput from './WidgetItemInput';

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
          <TextInput
            required
            source={`${source}.title`}
            label="resources.datalayer.widgets-editor.name"
          />
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
              {
                id: 'visible',
                name: 'resources.datalayer.widgets-editor.bounding-box-visible',
              },
              {
                id: 'defined',
                name: 'resources.datalayer.widgets-editor.bounding-box-defined',
              },
            ]}
            initialValue="visible"
          />
        </div>
        <Condition when={`${source}.boundingbox_mode`} is="defined">
          <MapBoundingBoxInput field={`${source}.boundingbox_value`} />
        </Condition>
        <Divider />
        <CardContent>
          <ArrayInput
            source={`${source}.items`}
            label="resources.datalayer.widgets-editor.items"
          >
            <SimpleFormIterator>
              <WidgetItemInput />
            </SimpleFormIterator>
          </ArrayInput>
        </CardContent>
      </Card>
    </>
  );
};

export default WidgetCard;
