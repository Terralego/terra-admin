import React, { useState } from 'react';
import { InputGroup, Button } from '@blueprintjs/core';

import './styles.scss';

const Search = () => {
  const [query, setQuery] = useState('');
  return (
    <div className="rando-search">
      <InputGroup
        leftIcon="filter"
        value={query}
        onChange={({ target: { value } }) => setQuery(value)}
        rightElement={(
          <Button
            icon="cross"
            onClick={() => setQuery('')}
            minimal
          />
        )}
      />
    </div>
  );
};

export default Search;
