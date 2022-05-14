import { createContext, useContext } from 'react';

export const userObjContext = createContext(null);
export const refreshUserContext = createContext(null);

export const useUserObj = () => useContext(userObjContext);
export const useRefreshUser = () => useContext(refreshUserContext);