import React from 'react';

import { TabbedForm, FormTab } from 'react-admin';

import JSONInput from '../../../../components/react-admin/JSONInput';
import CustomFormTab from '../../../../components/react-admin/CustomFormTab';

import DefinitionTab from './tabs/DefinitionTab';
import StyleTab from './tabs/StyleTab';
import LegendTab from './tabs/LegendTab';
import PopupTab from './tabs/PopupTab';
import MinisheetTab from './tabs/MinisheetTab';
import FilterTab from './tabs/FilterTab';
import TableTab from './tabs/TableTab';

const DataLayerForm = ({ ...props }) => {
  const [external, setExternal] = React.useState(true);
  const [popupInError, setPopupInError] = React.useState(false);
  const [miniSheetInError, setMiniSheetInError] = React.useState(false);
  const [tableInError, setTableInError] = React.useState(false);
  const [filterInError, setFilterInError] = React.useState(false);

  const onPopupErrorChange = React.useCallback(({
    values: {
      fields: sourcefields,
      popup_config: { wizard: { fields: popupfields = [] } = {} } = {},
    },
    errors: { fields = [], popup_config: popupConfig },
    touched,
  }) => {
    const popupfieldIds = popupfields.flatMap(({ sourceFieldId }) => sourceFieldId);
    const fieldIndexes = sourcefields
      .map((field, index) => (
        popupfieldIds.includes(field.sourceFieldId) ? index : null))
      .filter(Boolean);
    const fieldsInError = fields.filter((f, index) => f && fieldIndexes.includes(index));

    let inError = false;
    if (fieldsInError.length > 0) {
      inError = true;
    }
    if (popupConfig && touched['popup_config.wizard.fields[0]']) {
      inError = true;
    }
    setPopupInError(inError);
  }, [setPopupInError]);

  const onMiniSheetErrorChange = React.useCallback(({
    values: {
      fields: sourcefields,
      minisheet_config: { wizard: { tree = [] } = {} } = {},
    },
    errors: { fields = [], minisheet_config: minisheetConfig },
    touched,
  }) => {
    const minisheetFieldIds = tree.flatMap(({ children, sourceFieldId }) => {
      if (sourceFieldId) {
        return sourceFieldId;
      }
      const ids = children.flatMap(({ sourceFieldId: id }) => id);
      return ids;
    });
    const fieldIndexes = sourcefields
      .map((field, index) => (minisheetFieldIds.includes(field.sourceFieldId) ? index : null))
      .filter(Boolean);
    const fieldsInError = fields.filter((f, index) => f && fieldIndexes.includes(index));

    let inError = false;
    if (fieldsInError.length > 0) {
      inError = true;
    }
    if (minisheetConfig && touched['minisheet_config.wizard.title']) {
      inError = true;
    }
    setMiniSheetInError(inError);
  }, [setMiniSheetInError]);

  const onTableErrorChange = React.useCallback(({
    values: { fields = [], table_enable: tableEnable },
  }) => {
    const someLabelMissing = tableEnable && fields.some(({ label }) => !label);
    setTableInError(someLabelMissing);
  }, [setTableInError]);

  const onFilterErrorChange = React.useCallback(({ values: { fields = [] } }) => {
    const someLabelMissing = fields
      .filter(({ filter_enable: filterEnable }) => filterEnable)
      .some(({ label }) => !label);
    setFilterInError(someLabelMissing);
  }, [setFilterInError]);


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

      <CustomFormTab
        disabled={external}
        label="datalayer.form.popup.tab"
        path="popup"
        inError={popupInError}
        onChange={onPopupErrorChange}
      >
        <PopupTab />
      </CustomFormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.minisheet.tab"
        path="minisheet"
        onChange={onMiniSheetErrorChange}
        inError={miniSheetInError}
      >
        <MinisheetTab />
      </CustomFormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.filter.tab"
        path="filter2"
        onChange={onFilterErrorChange}
        inError={filterInError}
      >
        <FilterTab />
      </CustomFormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.table.tab"
        path="table"
        onChange={onTableErrorChange}
        inError={tableInError}
      >
        <TableTab />
      </CustomFormTab>

      <FormTab disabled={external} label="datalayer.form.widget.tab" path="other">
        <JSONInput source="settings.widgets" label="resources.datalayer.fields.settings-widgets" fullWidth />
      </FormTab>
    </TabbedForm>
  );
};

export default DataLayerForm;
