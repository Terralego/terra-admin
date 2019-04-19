import i18n from 'i18next';

import {
  TYPE_MANY,
  TYPE_RANGE,
  TYPE_SINGLE,
} from 'mc-tf-test/modules/Forms/Filters';

export const schemaSimpleSearch = [
  {
    name: 'cities',
    property: 'communes',
    label: i18n.t('opp.form.municipalities'),
    type: TYPE_SINGLE,
    values: ['Le lamentin', 'Case-Pilote'],
  }, {
    name: 'themes',
    property: 'themes[]',
    label: i18n.t('opp.form.themes'),
    type: TYPE_MANY,
    placeholder: i18n.t('opp.form.filters'),
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  }, {
    property: 'viewpointDate',
    label: i18n.t('opp.form.date'),
    format: 'date',
    className: 'date_range',
    shortcuts: false,
    contiguousCalendarMonths: false,
    allowSingleDayRange: true,
    startInputProps: {
      placeholder: 'JJ/MM/AAAA',
      className: 'input-range input-range--start',
    },
    endInputProps: {
      placeholder: 'JJ/MM/AAAA',
      className: 'input-range input-range--end',
    },
    type: TYPE_RANGE,
  },
];

export const schemaAdvancedSearch = [
  {
    name: 'cities',
    property: 'communes',
    label: i18n.t('opp.form.municipalities'),
    type: TYPE_SINGLE,
    values: ['Le lamentin', 'Case-Pilote'],
  }, {
    name: 'themes',
    property: 'themes[]',
    label: i18n.t('opp.form.themes'),
    type: TYPE_MANY,
    placeholder: i18n.t('opp.form.filters'),
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  }, {
    property: 'viewpointDate',
    label: i18n.t('opp.form.date'),
    format: 'date',
    className: 'date_range',
    shortcuts: false,
    contiguousCalendarMonths: false,
    allowSingleDayRange: true,
    startInputProps: {
      placeholder: i18n.t('opp.form.date-format'),
      className: 'input-range input-range--start',
    },
    endInputProps: {
      placeholder: i18n.t('opp.form.date-format'),
      className: 'input-range input-range--end',
    },
    type: TYPE_RANGE,
  }, {
    property: 'keywords[]',
    label: i18n.t('opp.form.keywords'),
    type: TYPE_MANY,
    placeholder: i18n.t('opp.form.filters'),
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'typology[]',
    label: i18n.t('opp.form.typology'),
    type: TYPE_MANY,
    placeholder: i18n.t('opp.form.filters'),
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'photographer',
    label: i18n.t('opp.form.photographer'),
    type: TYPE_SINGLE,
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'label',
    label: i18n.t('opp.form.viewpoint-name'),
    type: TYPE_SINGLE,
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'pictures__id',
    label: i18n.t('opp.form.picture-id'),
    type: TYPE_SINGLE,
    values: ['148', '59', '9992'],
  },
];

export default { schemaSimpleSearch, schemaAdvancedSearch };
