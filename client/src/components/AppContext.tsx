import { createContext } from 'react';
import { Auth, UserGroceryList } from '../lib/dataTypes';

type AppContextValues = {
  user: UserGroceryList | undefined;
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
