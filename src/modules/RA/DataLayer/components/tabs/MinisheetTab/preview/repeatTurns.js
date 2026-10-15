import React from 'react';

import formatValue from './formatValue';

const isMissing = value => value === null || value === undefined || value === '';

/**
 * Turns of a Repeat block: each field of its list that has a value, with the
 * properties its blocks are given, where `$value`, `$formatted_value`,
 * `$icon`, `$label` and `$field` are the raw value, the text of the value in
 * the format of the field, its icon (a boolean's, else empty), the label and
 * the name of the field.
 */
export const repeatTurns = (block, properties = {}, locale) => (block.fields ?? [])
  .filter(item => item.field && !isMissing(properties[item.field]))
  .map(item => {
    const { text, icon = '' } = formatValue(properties[item.field], { format: item.format }, locale);
    return {
      item,
      properties: {
        ...properties,
        $value: properties[item.field],
        $formatted_value: text,
        $icon: icon,
        $label: item.label ?? '',
        $field: item.field,
      },
    };
  });

/** The field of the turn, which the Field blocks of a Repeat show. */
export const RepeatTurnContext = React.createContext(null);

export default repeatTurns;
