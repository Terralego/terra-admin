import React from 'react';
import { useField } from 'react-final-form';
import { SelectInput, required } from 'react-admin';
import { useTranslation } from 'react-i18next';

const IdFieldSelect = ({ fields, ...props }) => {
  const { t } = useTranslation();
  const { input: { value, onChange } } = useField('id_field');

  const choices = React.useMemo(
    () => (fields ?? []).map(field => ({ id: field.name, name: field.name })),
    [fields],
  );

  React.useEffect(() => {
    if (value && choices.length > 0 && !choices.some(choice => choice.id === value)) {
      onChange('');
    }
  }, [value, choices, onChange]);

  return (
    <SelectInput
      source="id_field"
      label="datasource.form.uid-field"
      validate={required()}
      helperText={t('datasource.form.uid-field-help')}
      choices={choices}
      translateChoice={false}
      disabled={choices.length === 0}
      {...props}
    />
  );
};

export default IdFieldSelect;
