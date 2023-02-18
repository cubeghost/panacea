import React, { useContext } from 'react';

import { User } from '!@prisma/client';
import { PreferencesObject } from '~/utils/preferences';
import invariant from 'tiny-invariant';

export interface UserWithPreferences extends Omit<User, 'preferences'> {
  preferences?: PreferencesObject;
}

export const UserContext = React.createContext<UserWithPreferences | null>(null);

export const useAuthedUser = (): UserWithPreferences => {
  const user = useContext(UserContext);
  invariant(user, 'authed user should be present');
  // TODO merge default preferences
  return user;
};