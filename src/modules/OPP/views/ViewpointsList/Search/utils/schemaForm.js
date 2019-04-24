import i18n from 'i18next';

import {
  TYPE_MANY,
  TYPE_RANGE,
  TYPE_SINGLE,
} from 'mc-tf-test/modules/Forms/Filters';

export const schema = [
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
    name: 'date',
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
  }, {
    name: 'keywords',
    property: 'keywords[]',
    label: i18n.t('opp.form.keywords'),
    type: TYPE_MANY,
    placeholder: i18n.t('opp.form.filters'),
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  },
  {
    name: 'typology',
    property: 'typology[]',
    label: i18n.t('opp.form.typology'),
    type: TYPE_MANY,
    placeholder: i18n.t('opp.form.filters'),
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  },
  {
    name: 'photographer',
    property: 'photographer',
    label: i18n.t('opp.form.photographer'),
    type: TYPE_SINGLE,
    values: ['Montagnes', 'Éolienne'],
  },
  {
    name: 'label',
    property: 'label',
    label: i18n.t('opp.form.viewpoint-name'),
    type: TYPE_SINGLE,
    values: ['Montagnes', 'Éolienne'],
  },
  {
    name: 'pictures__id',
    property: 'pictures__id',
    label: i18n.t('opp.form.picture-id'),
    type: TYPE_SINGLE,
    values: ['148', '59', '9992', '1', '4', '9', '55', '0', '654', '76', '3'],
  },
];

export default { schema };
