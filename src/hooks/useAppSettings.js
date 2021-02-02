import React from 'react';
import { context } from '../components/AppProvider';

const useAppSettings = () => React.useContext(context)?.env;

export default useAppSettings;
