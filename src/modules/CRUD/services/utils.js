export const getObjectOrderedValue = (objectValues, arrayOrder = []) => {
  if (!objectValues) {
    return {};
  }
  const UIOrderReverse = [...arrayOrder].reverse();
  return Object.keys(objectValues).sort(
    ((a, b) => UIOrderReverse.indexOf(b) - UIOrderReverse.indexOf(a)),
  ).reduce((acc, prop) => (
    { ...acc, [prop]: objectValues[prop] }
  ), {});
};

export const sanitizeCustomEndpoint = str => {
  if (str.startsWith('/api/')) {
    return str.replace('/api/', '');
  }
  return str;
};

export default { getObjectOrderedValue, sanitizeCustomEndpoint };
