import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, HTMLSelect, InputGroup, Tag } from '@blueprintjs/core';
import './styles.scss';


const CategorySelector = ({ attachments, attachment, onChange, onSubmit, t }) => {
  const options = useMemo(() => (
    attachments
      .map(({ category, [attachment]: attach }) => attach.length && category)
      .filter(Boolean)
  ), [attachment, attachments]);

  const [selectValue, setSelectValue] = useState(options[0].name);

  const [inputValue, setInputValue] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(options[0]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const getValueFromId = useCallback(id => {
    if (id === '') {
      return { id: null, name: inputValue };
    }
    return options.find(({ id: optionID }) => `${optionID}` === id);
  }, [inputValue, options]);

  const handleChange = useCallback(({ target: { name, value } }) => {
    let nextValue = '';

    if (name === 'category-selector') {
      nextValue = value === '' ? inputValue : value;
      setSelectedCategory(getValueFromId(nextValue));
      setSelectValue(value);
    }

    if (name === 'category-selector-other') {
      setInputValue(value);
      nextValue = value;
      setSelectedCategory({ id: null, name: nextValue });
    }

    onChange(nextValue);
  }, [getValueFromId, inputValue, onChange]);

  const handleCancel = useCallback(() => {
    setIsSubmitted(false);
    onSubmit({});
  }, [onSubmit]);

  const handleSubmit =  useCallback(event => {
    event.preventDefault();
    setIsSubmitted(true);
    onSubmit(selectedCategory);
  }, [onSubmit, selectedCategory]);


  const Select = ({ value }) => (
    <HTMLSelect onChange={handleChange} name="category-selector" value={value}>
      {options.map(({ id, name: categoryName }) => (
        <option key={id} value={id}>{categoryName}</option>
      ))}
      <option value="">{t('CRUD.details.attachment.category.new')}</option>
    </HTMLSelect>
  );

  if (isSubmitted) {
    return (
      <div className="category-selector category-selector--submitted">
        <FormGroup
          inline
          helperText={t('CRUD.details.attachment.category.helper')}
        >
          <Tag large onRemove={handleCancel}>{selectedCategory.name}</Tag>
        </FormGroup>
      </div>
    );
  }

  return (
    <div className="category-selector">
      <form onSubmit={handleSubmit} className="category-selector__inner">
        <FormGroup
          label={t('CRUD.details.attachment.category.select')}
          labelFor="category-selector"
          inline
          helperText={t('CRUD.details.attachment.category.helper')}
        >
          {selectValue !== ''
            ? <Select value={selectValue} />
            : (
              <InputGroup
                autoFocus
                id="category-selector"
                placeholder={t('CRUD.details.attachment.category.input')}
                name="category-selector-other"
                onChange={handleChange}
                rightElement={<Select value={selectValue} />}
                required
                value={inputValue}
              />
            )}
        </FormGroup>
        <Button type="submit" className="category-selector__submit" intent="primary" text={t('CRUD.details.attachment.category.select')} />
      </form>
    </div>
  );
};

CategorySelector.propTypes = {
  attachment: PropTypes.string.isRequired,
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
  ),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  t: PropTypes.func,
};

CategorySelector.defaultProps = {
  attachments: [],
  onChange: () => {},
  onSubmit: () => {},
  t: () => {},
};

export default CategorySelector;
