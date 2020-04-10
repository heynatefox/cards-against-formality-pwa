import React, { useRef, useEffect } from 'react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';

export interface RouterContextProps extends RouteComponentProps {
  prevLocation: any;
}

export const RouterContext = React.createContext<RouterContextProps>(null as any);

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}


function InnerProvider({ children, ...routeProps }: any) {
  const prevLocation = usePrevious(routeProps.location);
  return <RouterContext.Provider value={{ ...routeProps, prevLocation }}>
    {children}
  </RouterContext.Provider>
}

export default function RouteProvider({ children }: any) {
  return <BrowserRouter>
    <Route>
      {(routeProps: RouteComponentProps) => <InnerProvider children={children} {...routeProps} />}
    </Route>
  </BrowserRouter>;
}