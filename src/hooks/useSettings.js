import React from 'react';
import { context } from '../components/AppProvider';

const useSettings = () => React.useContext(context)?.env;

export default useSettings;
