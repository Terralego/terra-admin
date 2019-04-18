import {
  TYPE_MANY,
  TYPE_RANGE,
  TYPE_SINGLE,
} from 'mc-tf-test/modules/Forms/Filters';

export const schemaSimpleSearch = [
  {
    property: 'communes',
    label: 'Commune',
    type: TYPE_SINGLE,
    placeholder: 'Le lamentin...',
    values: ['Le lamentin', 'Case-Pilote'],
  }, {
    property: 'themes[]',
    label: 'Thèmes',
    type: TYPE_MANY,
    placeholder: 'Montagnes...',
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  }, {
    property: 'viewpointDate',
    label: 'Date',
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
    property: 'communes',
    label: 'Commune',
    type: TYPE_SINGLE,
    placeholder: 'Le lamentin...',
    values: ['Le lamentin', 'Case-Pilote'],

  }, {
    property: 'themes[]',
    label: 'Thèmes',
    type: TYPE_MANY,
    placeholder: 'Montagnes...',
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  }, {
    property: 'viewpointDate',
    label: 'Date',
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
    property: 'keywords[]',
    label: 'Mots clés',
    type: TYPE_MANY,
    placeholder: 'Filtres...',
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'typology[]',
    label: 'Typologie des paysages',
    type: TYPE_MANY,
    placeholder: 'Filtres...',
    display: 'select',
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'photographer',
    label: 'Photographe',
    type: TYPE_SINGLE,
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'label',
    label: 'Nom du point de vue',
    type: TYPE_SINGLE,
    values: ['Montagnes', 'Éolienne'],
  },
  {
    property: 'pictures__id',
    label: 'Id de la Photographie',
    type: TYPE_SINGLE,
    values: ['148', '59', '9992'],
  },
];

export default { schemaSimpleSearch, schemaAdvancedSearch };
