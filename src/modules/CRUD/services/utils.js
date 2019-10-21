export const sanitizeCustomEndpoint = str => {
  if (str.startsWith('/api/')) {
    return str.replace('/api/', '');
  }
  return str;
};

export default { sanitizeCustomEndpoint };
