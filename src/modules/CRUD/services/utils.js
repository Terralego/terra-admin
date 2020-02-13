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

export const isTableObject = (arrayOfObjects = []) => {
  if (!arrayOfObjects.length) {
    return false;
  }
  const firstKeys = Object.keys(arrayOfObjects[0]).join();
  return arrayOfObjects.every(obj => Object.keys(obj).join() === firstKeys);
};

export const sanitizeCustomEndpoint = str => {
  if (str.startsWith('/api/')) {
    return str.replace('/api/', '');
  }
  return str;
};

export default { getObjectOrderedValue, isTableObject, sanitizeCustomEndpoint };
