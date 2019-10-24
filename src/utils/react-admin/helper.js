export const toSlug = value => value
  .toLocaleLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ /g, '-')
  .replace(/[^a-z0-9.-]/g, '');

export const isObjectEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

export default { toSlug, isObjectEmpty };
