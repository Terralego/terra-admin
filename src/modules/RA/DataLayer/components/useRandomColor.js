import { useField } from 'react-final-form';
import randomColor from 'randomcolor';

/**
 * Return a random color according with form name as seed.
 * @param {string} seed
 */
export const useRandomColor = ({ fieldName = 'name', seed } = {}) => {
  const { input: { value: colorSeed } } = useField(fieldName);

  return randomColor({ seed: seed || colorSeed || 'noname' });
};

export default useRandomColor;
