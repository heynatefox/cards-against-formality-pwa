
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';


export interface SocketEventMap {
  [eventName: string]: (data: any) => void,
}


export default function useSocket(token: string, socketEventMap: SocketEventMap, namespace: string = '/', autoConnect: boolean = true): [SocketIOClient.Socket | null] {

  const socket = useRef<SocketIOClient.Socket | null>(null);
  useEffect(() => {
    if (token?.length) {
      socket.current = io(`localhost${namespace}`, {
        transports: ['websocket'],
        path: '/socket',
        autoConnect: false,
        query: {
          auth: token
        }
      });

      if (socket?.current) {
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
  }, [token, namespace, socketEventMap, autoConnect]);

  return [socket?.current]
}