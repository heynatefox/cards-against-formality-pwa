import React from 'react';

export interface ConfigContextProps {
  baseUrl: string;
  socketUrl: string;
}

export default React.createContext<ConfigContextProps>({} as any);
