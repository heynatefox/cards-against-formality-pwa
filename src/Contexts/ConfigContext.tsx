import React from 'react';

export interface ConfigContextProps {
  baseUrl: string
}

export default React.createContext<ConfigContextProps>({} as any);
