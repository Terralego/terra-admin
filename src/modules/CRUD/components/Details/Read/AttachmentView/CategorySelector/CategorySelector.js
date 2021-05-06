import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, FormGroup, Menu, MenuDivider, MenuItem, Position } from '@blueprintjs/core';
import { remove } from 'diacritics';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Suggest } from '@blueprintjs/select';
import { CRUDContext } from '../../../../../services/CRUDProvider';
import './styles.scss';


const CategorySelector = ({ attachments, attachment, onSubmit }) => {
  const [isCategoriesLoaded, setCategoriesLoaded] = useState(false);
  const { t } = useTranslation();


  const [options, setOptions] = useState(() => (
    attachments
      .map(({ category, [attachment]: attach }) => attach.length && { ...category, title: t('CRUD.details.attachment.category.existing-list') })
      .filter(Boolean)
  ));

  const {
    getAttachmentCategories,
    settings: {
      config: {
        attachment_categories: attachmentCategoriesEndpoint,
      },
    },
  } = useContext(CRUDContext);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (isCategoriesLoaded) {
      return;
    }
    async function fetchCategories () {
      const list = await getAttachmentCategories(attachmentCategoriesEndpoint);
      const categories = list.results
        .filter(item => !options.find(option => option.id === item.id))
        .map(item => ({ ...item, title: t('CRUD.details.attachment.category.other-list') }));

      if (!isMounted.current) return;

      setCategoriesLoaded(true);
      setOptions(prevOptions => [...prevOptions, ...categories]);
    }
    fetchCategories();
  }, [attachmentCategoriesEndpoint, getAttachmentCategories, isCategoriesLoaded, options, t]);


  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleValueChange = useCallback(value => {
    setSelectedCategory(value);
  }, []);

  const handleSubmit =  useCallback(event => {
    event.preventDefault();
    onSubmit(selectedCategory);
  }, [onSubmit, selectedCategory]);

  const createNewItemRenderer = (
    query,
    active,
    handleClick,
  ) => (
    <MenuItem
      icon="add"
      text={t('CRUD.details.attachment.category.create', { name: query })}
      active={active}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  );

  const itemRenderer = (option, { handleClick }) => (
    <MenuItem
      key={option.id}
      text={option.name}
      onClick={handleClick}
    />
  );

  const itemListRenderer = ({ filteredItems, renderItem, renderCreateItem }) => {
    const filteredItemsByGroupTitle = filteredItems.reduce((acc, item) => {
      if (acc[item.title]) {
        acc[item.title].push(item);
      } else {
        acc[item.title] = [item];
      }
      return acc;
    }, {});
    if (Object.values(filteredItemsByGroupTitle).length) {
      return Object.entries(filteredItemsByGroupTitle).map(([key, value]) => (
        <Menu key={key}>
          <MenuDivider title={key} />
          {value.map(renderItem)}
        </Menu>
      ));
    }
    return <Menu>{renderCreateItem()}</Menu>;
  };

  const itemPredicate = (query, option, _index, exactMatch) => {
    const normalizedName = option.name.toLowerCase();
    const normalizedQuery = query ? remove(query.toLowerCase()) : '';
    if (exactMatch) {
      return normalizedName === normalizedQuery;
    }
    return normalizedName.indexOf(normalizedQuery) >= 0;
  };

  return (
    <div className="category-selector">
      <form onSubmit={handleSubmit} className="category-selector__inner">
        <FormGroup
          label={t('CRUD.details.attachment.category.select')}
          labelFor="category-selector"
          inline
          helperText={t('CRUD.details.attachment.category.helper')}
        >
          <Suggest
            createNewItemFromQuery={name => ({ id: null, name })}
            createNewItemRenderer={createNewItemRenderer}
            fill
            inputProps={{
              id: 'category-selector',
              name: 'category-selector',
              placeholder: t('CRUD.details.attachment.category.input'),
              required: true,
            }}
            inputValueRenderer={option => option.name}
            itemRenderer={itemRenderer}
            items={options}
            placeholder={t('CRUD.details.attachment.category.input')}
            itemsEqual={(a, b) => a.name.toLowerCase() === b.name.toLowerCase()}
            itemListRenderer={itemListRenderer}
            itemPredicate={itemPredicate}
            onItemSelect={handleValueChange}
            popoverProps={{
              position: Position.BOTTOM,
              popoverClassName: 'category-selector__suggestions',
            }}
          />
        </FormGroup>
        <Button
          className="category-selector__submit"
          intent="primary"
          text={t(`CRUD.details.attachment.category.submit.${attachment.toLowerCase()}`)}
          type="submit"
        />
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
  onSubmit: PropTypes.func,
};

CategorySelector.defaultProps = {
  attachments: [],
  onSubmit: () => {},
};

export default CategorySelector;
