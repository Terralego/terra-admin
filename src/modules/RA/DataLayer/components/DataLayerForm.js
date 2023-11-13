import React from 'react';

import { TabbedForm, FormTab, ArrayInput, SimpleFormIterator, TabbedFormTabs } from 'react-admin';

import JSONInput from '../../../../components/react-admin/JSONInput';
import CustomFormTab from '../../../../components/react-admin/CustomFormTab';

import DefinitionTab from './tabs/DefinitionTab';
import StyleTab from './tabs/StyleTab';
import LegendTab from './tabs/LegendTab';
import PopupTab from './tabs/PopupTab';
import MinisheetTab from './tabs/MinisheetTab';
import FilterTab from './tabs/FilterTab';
import TableTab from './tabs/TableTab';
import StyleImageField from './StyleImageField';
import EmbedTab from './tabs/EmbedTab';

const initialErrorState = {
  definition: false,
  style: false,
  legend: false,
  popup: false,
  minisheet: false,
  filter: false,
  table: false,
  embed: false,
};

const inErrorReducer = (state, { type, payload }) => {
  if (state[type] === Boolean(payload)) {
    return state;
  }
  // Avoid recursive rendering due to React-admin logic
  // eslint-disable-next-line no-param-reassign
  state[type] = Boolean(payload);
  return state;
};

const DataLayerForm = React.memo(props => {
  const [external, setExternal] = React.useState(true);
  const [errorState, dispatch] = React.useReducer(inErrorReducer, initialErrorState);

  const onPopupErrorChange = React.useCallback(({
    values: {
      fields: sourcefields,
      popup_config: { wizard: { fields: popupfields = [] } = {} } = {},
    },
    errors: { fields = [],
      popup_config: { wizard: { fields: popupfieldsErrors = [] } = {} } = {} },
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
    if (popupfieldsErrors[0]?.sourceFieldId && touched['popup_config.wizard.fields[0]']) {
      inError = true;
    }
    dispatch({ type: 'popup', payload: inError });
  }, []);

  const onMiniSheetErrorChange = React.useCallback(({
    values: {
      fields: sourcefields,
      minisheet_config: { wizard: { tree = [] } = {} } = {},
    },
    errors: { fields = [] },
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

    dispatch({ type: 'minisheet', payload: inError });
  }, []);

  const onEmbedErrorChange = React.useCallback(() => {
    dispatch({ type: 'embed', paylaod: false });
  }, []);

  const onTableErrorChange = React.useCallback(({
    values: { fields = [], table_enable: tableEnable },
  }) => {
    const someLabelMissing = tableEnable && fields.some(({ label }) => !label);
    dispatch({ type: 'table', paylaod: someLabelMissing });
  }, []);

  const onFilterErrorChange = React.useCallback(({ values: { fields = [] } }) => {
    const someLabelMissing = fields
      .filter(({ filter_enable: filterEnable }) => filterEnable)
      .some(({ label }) => !label);
    dispatch({ type: 'filter', payload: someLabelMissing });
  }, []);

  const onLegendErrorChange = React.useCallback(({ errors }) => {
    dispatch({ type: 'legend', payload: ('legends' in errors) });
  }, []);

  const onStyleErrorChange = React.useCallback(({ errors }) => {
    dispatch({ type: 'style', payload: ('main_style' in errors) });
  }, []);

  const onDefinitionErrorChange = React.useCallback(({ errors, touched }) => {
    let inError = false;
    if (touched.name && ('name' in errors)) {
      inError = true;
    }
    if (touched.source && ('source' in errors)) {
      inError = true;
    }
    dispatch({ type: 'definition', payload: inError });
  }, []);

  return (
    <TabbedForm tabs={<TabbedFormTabs variant="scrollable" scrollButtons="auto" />} sanitizeEmptyValues={false} {...props} initialValues={{ fields: [] }}>
      <CustomFormTab
        label="datalayer.form.definition"
        onChange={onDefinitionErrorChange}
        inError={errorState.definition}
      >
        <DefinitionTab onSwitch={setExternal} external={external} />
      </CustomFormTab>

      <FormTab label="datalayer.form.style-images.tab" path="style-images">
        <ArrayInput source="style_images">
          <SimpleFormIterator>
            <StyleImageField />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.styles.tab"
        path="style"
        onChange={onStyleErrorChange}
        inError={errorState.style}
      >
        <StyleTab external={external} />
      </CustomFormTab>

      <CustomFormTab
        label="datalayer.form.legend.tab"
        path="legend"
        onChange={onLegendErrorChange}
        inError={errorState.legend}
      >
        <LegendTab />
      </CustomFormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.popup.tab"
        path="popup"
        onChange={onPopupErrorChange}
        inError={errorState.popup}
      >
        <PopupTab />
      </CustomFormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.minisheet.tab"
        path="minisheet"
        inError={errorState.minisheet}
        onChange={onMiniSheetErrorChange}
      >
        <MinisheetTab />
      </CustomFormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.filter.tab"
        path="filter2"
        inError={errorState.filter}
        onChange={onFilterErrorChange}
      >
        <FilterTab />
      </CustomFormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.table.tab"
        path="table"
        inError={errorState.table}
        onChange={onTableErrorChange}
      >
        <TableTab />
      </CustomFormTab>

      <FormTab disabled={external} label="datalayer.form.widget.tab" path="other">
        <JSONInput source="settings.widgets" label="resources.datalayer.fields.settings-widgets" fullWidth />
      </FormTab>

      <CustomFormTab
        disabled={external}
        label="datalayer.form.embed.tab"
        path="embed"
        inError={errorState.embed}
        onChange={onEmbedErrorChange}
      >
        <EmbedTab />
      </CustomFormTab>
    </TabbedForm>
  );
});

export default DataLayerForm;
