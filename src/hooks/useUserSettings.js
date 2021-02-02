import React from 'react';
import { context } from '@terralego/core/modules/Auth/services/context';

const useUserSettings = () => React.useContext(context)?.user;

export default useUserSettings;
