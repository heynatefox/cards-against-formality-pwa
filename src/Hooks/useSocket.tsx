
import { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';

import ConfigContext from '../Contexts/ConfigContext';


export interface SocketEventMap {
  [eventName: string]: (data: any) => void,
}


export default function useSocket(
  token: string, socketEventMap: SocketEventMap, namespace: string = '/', autoConnect: boolean = true
): [SocketIOClient.Socket | null, boolean] {

  const [disconnected, setDisconnected] = useState(false);
  const socket = useRef<SocketIOClient.Socket | null>(null);
  const { baseUrl } = useContext(ConfigContext);
  useEffect(() => {
    if (token?.length) {
      socket.current = io(`${baseUrl}${namespace}`, {
        transports: ['websocket'],
        path: '/socket',
        autoConnect: false,
        query: {
          auth: token
        }
      });

      if (socket?.current) {
        socket.current.on('disconnect', () => {
          setDisconnected(true);
        })

        Object.entries(socketEventMap).forEach(([eventName, onEvent]) => {
          (socket as any).current.on(eventName, onEvent);
        });

        // Only connect if auto correct is true. Else let the hooks user decided.
        if (autoConnect && socket.current.disconnected) {
          socket.current.connect()
        }
      }
    }

    return () => {
      if (socket?.current) {
        socket.current.disconnect();
        socket.current.removeAllListeners();
      }
    }
  }, [token, namespace, socketEventMap, autoConnect, baseUrl]);

  return [socket?.current, disconnected]
}