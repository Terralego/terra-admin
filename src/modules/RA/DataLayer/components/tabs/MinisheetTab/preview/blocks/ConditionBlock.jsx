import React from 'react';

import conditionMet from '../conditionMet';

/** A Condition block: its `then` blocks when the condition holds, its `else` blocks otherwise. */
export const ConditionBlock = ({ block, properties, Blocks }) => {
  const { when, then: thenBlocks = [], else: elseBlocks = [] } = block;
  const blocks = conditionMet(when, properties) ? thenBlocks : elseBlocks;
  if (!blocks.length) {
    return null;
  }
  return <Blocks blocks={blocks} properties={properties} />;
};

export default ConditionBlock;
