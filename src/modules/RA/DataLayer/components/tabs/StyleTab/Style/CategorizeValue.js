
import React from 'react';
import get from 'lodash.get';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { Field, useField, useForm } from 'react-final-form';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { usePrevious } from '../../../../../../../utils/hooks';
import DragHandle from '../../../DragHandle';

import styles from './styles';

const useStyles = makeStyles(styles);

const DEFAULT_MAX_CATEGORIES = 100;

const CategorizedValue = ({ path, category, Component }) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className={classes.categoryLine}>
      <DragHandle withBorder />
      <Field name={path}>
        {({ input: { value, onChange } }) => (
          <Component
            value={value}
            onChange={onChange}
          />
        )}
      </Field>
      <span style={{ marginLeft: '1em' }}>
        {category.name || translate('style-editor.categorize.empty-category')}
      </span>
    </div>
  );
};

const SortableCategorizeValue = SortableElement(CategorizedValue);

const SortableComponentList = SortableContainer(({ values, path, Component }) => (
  <div>
    {values.map((category, index) => (
      <SortableCategorizeValue
        key={category.name}
        path={`${path}.categories[${index}].value`}
        category={category}
        Component={Component}
        index={index}
      />
    ))}
  </div>
));

const CategorizeValue = ({
  path,
  maxCategories = DEFAULT_MAX_CATEGORIES,
  getValuesOfProperty,
  Component,
  defaultValueGenerator,
  hasDefaultValue,
}) => {
  const translate = useTranslate();
  const mountedRef = React.useRef(true);
  const form = useForm();
  const [tooManyValues, setTooManyValues] = React.useState(false);
  const [valuesLoaded, setValuesLoaded] = React.useState(false);
  const { input: { value: field } } = useField(`${path}.field`);
  const { input: { value: valueList, onChange: setValueList } } = useField(`${path}.categories`);
  mountedRef.current = true;

  const prevField = usePrevious(field);

  React.useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  React.useEffect(() => {
    if (prevField !== field) {
      setValuesLoaded(false);
    }
  }, [prevField, field]);

  // Load values if field change or on mount
  React.useEffect(() => {
    const getValueList = async () => {
      setTooManyValues(false);
      const resultRaw = await getValuesOfProperty(field);
      const result = hasDefaultValue ? [null, ...resultRaw] : resultRaw;

      if (!mountedRef.current) return;

      if (result.length > maxCategories) {
        setTooManyValues(true);
        setValueList([]);
        setValuesLoaded(true);
        return;
      }

      const newValueList = (valueList || []).filter(({ name }) => result.includes(name));
      const nameList = newValueList.map(({ name }) => name);
      const toAdd = result.filter(name => !nameList.includes(name));

      if (newValueList.length < (valueList || []).length || toAdd.length) {
        const newValues = [
          ...newValueList,
          ...toAdd.map(val => ({ name: val, value: defaultValueGenerator(val) })),
        ];
        setValuesLoaded(true);
        setValueList(newValues);
      }
    };

    if (!valuesLoaded) {
      getValueList();
    }
  }, [
    defaultValueGenerator,
    field,
    getValuesOfProperty,
    maxCategories,
    setValueList,
    valueList,
    valuesLoaded,
    hasDefaultValue,
  ]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const { values } = form.getState();
    const { categories } = get(values, path);
    if (oldIndex !== newIndex) {
      categories.splice(newIndex, 0, categories.splice(oldIndex, 1)[0]);
      form.change(`${path}.categories`, [...categories]); // we need to create a new array or it does not work
    }
  };

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
      {valueList && (
      <SortableComponentList
        path={path}
        Component={Component}
        values={valueList}
        onSortEnd={onSortEnd}
        lockAxis="y"
        useDragHandle
      />
      )}
    </div>
  );
};

export default CategorizeValue;
