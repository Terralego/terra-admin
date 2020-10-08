import React from 'react';

import {
  TabbedForm,
  FormTab,
} from 'react-admin';

import compose from '../../../../utils/compose';
import JSONInput from '../../../../components/react-admin/JSONInput';

import DefinitionTab from './tabs/DefinitionTab';
import StyleTab from './tabs/StyleTab';
import LegendTab from './tabs/LegendTab';
import PopupTab from './tabs/PopupTab';
import MinisheetTab from './tabs/MinisheetTab';
import FilterTab from './tabs/FilterTab';
import TableConfigTabContent from './tabs/TableConfigTab';


const DataLayerForm = ({
  ...props
}) => {
  const [external, setExternal] = React.useState(true);

  return (
    <TabbedForm {...props} initialValues={{ fields: [] }}>

      <FormTab label="datalayer.form.definition">
        <DefinitionTab onSwitch={setExternal} external={external} />
      </FormTab>

      <FormTab disabled={external} label="datalayer.form.styles.tab" path="style">
        <StyleTab external={external} />
      </FormTab>

      <FormTab disabled={external} label="datalayer.form.legend.tab" path="legend">
        <LegendTab />
      </FormTab>

      <FormTab disabled={external} label="datalayer.form.popup.tab" path="popup">
        <PopupTab />
      </FormTab>

      <FormTab disabled={external} label="datalayer.form.minisheet.tab" path="minisheet">
        <MinisheetTab />
      </FormTab>

      <FormTab disabled={external} label="datalayer.form.filter.tab" path="filter2">
        <FilterTab />
      </FormTab>

      <FormTab disabled={external} label="datalayer.form.table.tab" path="table">
        <TableConfigTabContent />
      </FormTab>

      <FormTab disabled={external} label="datalayer.form.widget.tab" path="other">
        <JSONInput source="settings.widgets" label="resources.datalayer.fields.settings-widgets" fullWidth />
      </FormTab>

    </TabbedForm>
  );
};

const PropsSanitizer = WrappedComponent =>
  ({ withSource, dispatch, ...props }) => (<WrappedComponent {...props} />);

export default compose(
  PropsSanitizer,
)(DataLayerForm);
