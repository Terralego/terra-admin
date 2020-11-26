
import React from 'react';

import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { Field, useField } from 'react-final-form';

import { usePrevious } from '../../../../../../../utils/hooks';

import styles from './styles';

const useStyles = makeStyles(styles);

const DEFAULT_MAX_CATEGORIES = 20;

const CategorizeValue = ({
  path,
  maxCategories = DEFAULT_MAX_CATEGORIES,
  getValuesOfProperty,
  Component,
  defaultValueGenerator,
}) => {
  const translate = useTranslate();
  const classes = useStyles();
  const [tooManyValues, setTooManyValues] = React.useState(false);
  const { input: { value: field } } = useField(`${path}.field`);
  const { input: { value: valueList, onChange: setValueList } } = useField(`${path}.categories`);

  const prevField = usePrevious(field);

  React.useEffect(() => {
    let mounted = true;

    const getValueList = async () => {
      if (prevField === field) return;
      setTooManyValues(false);
      const result = await getValuesOfProperty(field);

      if (!mounted) return;

      if (result.length > maxCategories) {
        setTooManyValues(true);
        return;
      }

      const newValueList = (valueList || []).filter(({ name }) => result.includes(name));
      const nameList = newValueList.map(({ name }) => name);
      const toAdd = result.filter(name => !nameList.includes(name));

      if (newValueList.length < valueList.length || toAdd.length) {
        setValueList([
          ...newValueList,
          ...toAdd.map(val => ({ name: val, value: defaultValueGenerator() })),
        ]);
      }
    };

    getValueList();

    return () => {
      mounted = false;
    };
  }, [
    defaultValueGenerator,
    field,
    getValuesOfProperty,
    maxCategories,
    prevField,
    setValueList,
    valueList,
  ]);

  if (tooManyValues) {
    return <p>{translate('style-editor.categorize.too-many-values')}</p>;
  }

  if (valueList.length === 0) {
    return <p>{translate('style-editor.categorize.empty-category-list')}</p>;
  }

  return (
    <div style={{ marginTop: '1em' }}>
      <FormLabel>
        {translate('style-editor.categorize.categories')}
      </FormLabel>
      {valueList && valueList.map((category, index) => (
        <div key={category.name} className={classes.categoryLine}>
          <Field name={`${path}.categories[${index}].value`}>
            {({ input: { value, onChange } }) => (
              <Component
                value={value}
                onChange={onChange}
              />
            )}
          </Field>
          <span>
            {category.name || translate('style-editor.categorize.empty-category')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategorizeValue;
