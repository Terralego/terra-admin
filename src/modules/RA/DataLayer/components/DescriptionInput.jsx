import React, { useState } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import RichTextInput from 'ra-input-rich-text';
import { Labeled, TextInput, useTranslate } from 'react-admin';

const DescriptionInput = ({ source, label }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const translate = useTranslate();

  return (
    <>
      <Labeled label={label} />
      <Tabs
        value={currentTab}
        onChange={(_, newVal) => setCurrentTab(newVal)}
        style={{
          root: {
            textTransform: 'none',
          },
        }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label={translate('datalayer.form.description-rich')} />
        <Tab label={translate('datalayer.form.description-html')} />
      </Tabs>
      <div style={{ minHeight: 200 }}>
        {currentTab === 0 && <RichTextInput source={source} label="" />}
        {currentTab === 1 && (
          <TextInput multiline source={source} label="" fullWidth />
        )}
      </div>
    </>
  );
};

export default DescriptionInput;
