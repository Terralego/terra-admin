const error  = 'error';
const warn   = 'warn';
const off    = 'off';
const always = 'always';

module.exports = {
  root: true,
  extends: 'makina',

  // Custom rules
  rules: {
    'operator-linebreak':                [off],
    'react/destructuring-assignment':    [error],
    'react/no-this-in-sfc':              [error],
    'react/no-access-state-in-setstate': [error],
    'react/react-hooks/exhaustive-deps': [off],
    'react-hooks/exhaustive-deps':       [off],
  }
};
