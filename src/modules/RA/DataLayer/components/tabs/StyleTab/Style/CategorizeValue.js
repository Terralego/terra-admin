
import React from 'react';

import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { Field, useField } from 'react-final-form';

import { usePrevious } from '../../../../../../../utils/hooks';

const useStyles = makeStyles({
  configLine: {
    display: 'flex',
    alignItems: 'center',
    padding: '1em 0',
    width: '50%',
    '& > .grow': {
      flex: 1,
    },
  },
  graduateConfig: {
    display: 'flex',
    '& .method': {
      width: '20em',
      marginRight: '3em',
    },
    '& .count': {
      flex: '1',
    },
  },
});

const DEFAULT_MAX_CATEGORIES = 20;

const CategorizeValue = ({
  path,
  maxCategories = DEFAULT_MAX_CATEGORIES,
  getValuesOfProperty,
  Component,
  defaultValueGenerator = () => 0,
}) => {
  const translate = useTranslate();
  const classes = useStyles();
  const [tooManyValues, setTooManyValues] = React.useState(false);
  const { input: { value: field } } = useField(`${path}.field`);
  const { input: { value: valueList, onChange: setValueList } } = useField(`${path}.categories`);

  const prevField = usePrevious(field);

  React.useEffect(() => {
    const getValueList = async () => {
      if (prevField === field) return;
      setTooManyValues(false);
      const result = await getValuesOfProperty(field);

      if (result.length > maxCategories) {
        setTooManyValues(true);
        return;
      }

      const newValueList = valueList.filter(({ name }) => result.includes(name));
      const nameList = newValueList.map(({ name }) => name);
      const toAdd = result.filter(name => !nameList.includes(name));

      if (newValueList.length < valueList.length || toAdd.length) {
        setValueList([
          ...newValueList,
          toAdd.map(val => ({ name: val, value: defaultValueGenerator })),
        ]);
      }
    };
    getValueList();
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
    return <div>Too many values</div>;
  }

  if (valueList.length === 0) {
    return <div>No categories for this field</div>;
  }

  return (
    <div>
      {valueList && valueList.map((category, index) => (
        <div key={category.name}>
          <FormLabel>Category {category.name || "'empty'"}</FormLabel>
          <Field name={`${path}.categories[${index}].value`}>
            {({ input: { value, onChange } }) => (
              <Component
                value={value}
                onChange={onChange}
              />
            )}
          </Field>
        </div>
      ))}

    </div>
  );
};

export default CategorizeValue;
