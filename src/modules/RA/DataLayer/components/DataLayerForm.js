import React from 'react';

import {
  TabbedForm,
  FormTab,
  translate as translateRA,
  withDataProvider,
} from 'react-admin';

import { withStyles } from '@material-ui/core/styles';

import compose from '../../../../utils/compose';
import JSONInput from '../../../../components/react-admin/JSONInput';
import FieldUpdater from './FieldUpdater';


import DataLayerFormSwitcher from './DataLayerFormSwitcher';

import DefinitionTab from './tabs/DefinitionTab';
import StyleTab from './tabs/StyleTab';
import LegendTab from './tabs/LegendTab';
import PopupTab from './tabs/PopupTab';
import MinisheetTab from './tabs/MinisheetTab';
import FilterTab from './tabs/FilterTab';
import TableConfigTabContent from './tabs/TableConfigTab';


const styles = {
  colorPicker: {
    width: '25%',
  },
};

// Best performance when tabs have heavy content and produce multiple render
const LazyFormTab = ({ hidden, ...props }) => (
  hidden ? null : <FormTab {...props} />
);

const DataLayerForm = ({
  classes,
  translate,
  dataProvider,
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

      <LazyFormTab disabled={external} label="datalayer.form.legend.tab" path="legend">
        <LegendTab />
      </LazyFormTab>

      <LazyFormTab disabled={external} label="datalayer.form.popup.tab" path="popup">
        <PopupTab />
      </LazyFormTab>


      <LazyFormTab disabled={external} label="datalayer.form.minisheet.tab" path="minisheet">
        <MinisheetTab />
      </LazyFormTab>


      <LazyFormTab disabled={external} label="datalayer.form.filter.tab" path="filter">
        <FilterTab />
      </LazyFormTab>

      <FormTab disabled={external} label="datalayer.form.table.tab" path="table">
        <TableConfigTabContent />
      </FormTab>


      <LazyFormTab disabled={external} label="datalayer.form.widget.tab" path="other">
        <JSONInput source="settings.widgets" label="resources.datalayer.fields.settings-widgets" fullWidth />
      </LazyFormTab>

      <FormTab label="fieldUpdater" style={{ display: 'none' }}>
        <FieldUpdater />
        <DataLayerFormSwitcher onSwitch={setExternal} />
      </FormTab>
    </TabbedForm>
  );
};

const PropsSanitizer = WrappedComponent =>
  ({ withSource, dispatch, ...props }) => (<WrappedComponent {...props} />);

export default compose(
  withStyles(styles),
  translateRA,
  PropsSanitizer,
  withDataProvider,
)(DataLayerForm);
