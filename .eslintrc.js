const error  = 'error';
const warn   = 'warn';
const off    = 'off';
const always = 'always';

module.exports = {
  root: true,
  extends: [
    'react-app',
    'makina',
  ],

  // Custom rules
  rules: {
    'operator-linebreak':                [off],
    'react/destructuring-assignment':    [error],
    'react/no-this-in-sfc':              [error],
    'react/no-access-state-in-setstate': [error],
    'react/no-unknown-property':         [error, { ignore: ['prefix'] }],
    'import/no-cycle':                   [off],
  }
};
