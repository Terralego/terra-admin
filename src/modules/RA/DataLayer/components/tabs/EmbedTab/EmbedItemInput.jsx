import React, { useEffect } from 'react';
import { BooleanInput, NumberInput, SelectInput, TextInput, useTranslate } from 'react-admin';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useField } from 'react-final-form';
import Condition from '../../../../../../components/react-admin/Condition';
import BPIcon, { graphIcons } from '../../../../../../components/BPIcon';

const EmbedItemInput = ({ source }) => {
  const [previewExpanded, setPreviewExpanded] = React.useState(false);
  const translate = useTranslate();

  const iconChoices = React.useMemo(
    () =>
      graphIcons.map(bpIcon => ({
        id: bpIcon,
        name: <BPIcon icon={bpIcon} displayIconName />,
      })),
    [],
  );

  const {
    input: { value: url },
  } = useField(`${source}.src`);

  useEffect(() => {
    setPreviewExpanded(false);
  }, [url]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1em' }}>
        <SelectInput
          source={`${source}.icon`}
          label="datalayer.form.embed.icon"
          choices={iconChoices}
          translateChoice={false}
          helperText={false}
          SelectProps={{
            renderValue: value => <BPIcon icon={value} />,
          }}
          style={{ width: '5em', minWidth: '5em' }}
        />

        <TextInput
          label="datalayer.form.embed.title"
          source={`${source}.title`}
          type="text"
          style={{ width: '34em' }}
          helperText="datalayer.form.embed.title-help"
        />
      </div>
      <TextInput
        label="datalayer.form.embed.src"
        source={`${source}.src`}
        type="url"
        style={{ width: '40em' }}
        placeholder="https://myiframe.page"
        helperText="datalayer.form.embed.src-help"
      />
      <Condition
        when={`${source}.src`}
        is={val => val.match(/(^(https?:)?\/\/.)/)}
      >
        <Accordion
          expanded={previewExpanded}
          onChange={(_, val) => setPreviewExpanded(val)}
          style={{ width: '40em', marginBottom: '2em' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{translate('datalayer.form.embed.preview')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {previewExpanded && (
              <iframe width="100%" height="300px" title="preview" src={url} />
            )}
          </AccordionDetails>
        </Accordion>
      </Condition>
      <BooleanInput
        label="datalayer.form.embed.fullscreen"
        source={`${source}.fullScreen`}
        defaultValue
      />
      <Condition when={`${source}.fullScreen`} is={false}>
        <div style={{ display: 'flex', gap: '2em' }}>
          <NumberInput
            source={`${source}.size.width`}
            label="datalayer.form.embed.width"
            min={0}
            step={1}
          />
          <NumberInput
            source={`${source}.size.height`}
            label="datalayer.form.embed.height"
            min={0}
            step={1}
          />
        </div>
      </Condition>
    </div>
  );
};

export default EmbedItemInput;
