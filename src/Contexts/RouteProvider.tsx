import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

export const RouterContext = React.createContext<any>({});

export default function RouteProvider({ children }: any) {
  return <BrowserRouter>
    <Route>
      {(routeProps: any) => (
        <RouterContext.Provider value={routeProps}>
          {children}
        </RouterContext.Provider>
      )}
    </Route>
  </BrowserRouter>;
}