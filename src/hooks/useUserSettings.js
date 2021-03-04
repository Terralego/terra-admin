import React from 'react';
import { context } from '@terralego/core/modules/Auth/services/context';


const useUserSettings = () => {
  const { user } = React.useContext(context);
  const hasPermission = React.useCallback(perm => {
    if (!user) {
      return false;
    }
    return user.permissions.includes(perm);
  }, [user]);
  return { ...user, hasPermission };
};

export default useUserSettings;
