import React from 'react';
import { AppContext } from '../components/AppProvider';

const useAppSettings = () => React.useContext(AppContext)?.env;

export default useAppSettings;
