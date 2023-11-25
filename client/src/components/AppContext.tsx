import { createContext } from 'react';
import { Auth, User } from '../lib/dataTypes';

type AppContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (auth: Auth) => void;
  handleSignOut: () => void;
};

export const AppContext = createContext<AppContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});
