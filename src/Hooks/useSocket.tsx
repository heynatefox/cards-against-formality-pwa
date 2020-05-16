
import { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';

import ConfigContext from '../Contexts/ConfigContext';
import { auth } from 'firebase';


export interface SocketEventMap {
  [eventName: string]: (data: any) => void,
}


export default function useSocket(
  socketEventMap: SocketEventMap, namespace: string = '/', autoConnect: boolean = true
): [SocketIOClient.Socket | null, boolean, boolean] {

  const [reconnecting, setReconnecting] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const socket = useRef<SocketIOClient.Socket | null>(null);
  const { baseUrl } = useContext(ConfigContext);
  useEffect(() => {
    let disconnectedTimeout: NodeJS.Timeout | null;
    auth().currentUser?.getIdToken()
      .then((token) => {

        socket.current = io(`${baseUrl}${namespace}`, {
          transports: ['websocket'],
          path: '/socket',
          autoConnect: autoConnect,
          reconnection: true,
          reconnectionDelay: 500,
          query: {
            auth: token
          }
        });

        if (socket?.current) {
          socket.current.on('connect', function () {
            if (disconnectedTimeout) {
              clearTimeout(disconnectedTimeout);
              disconnectedTimeout = null;
            }
            setReconnecting(false);
            setDisconnected(false);
          });

          socket.current.on('disconnect', () => {
            disconnectedTimeout = setTimeout(() => {
              setDisconnected(true);
            }, 1000);
          })

          socket.current.on('reconnecting', () => {
            setReconnecting(true);
          });

          Object.entries(socketEventMap).forEach(([eventName, onEvent]) => {
            (socket as any).current.on(eventName, onEvent);
          });

          // Only connect if auto correct is true. Else let the hooks user decided.
          if (autoConnect && socket.current.disconnected) {
            socket.current.connect()
          }
        }
      });

    return () => {
      if (socket?.current) {
        socket.current.disconnect();
        socket.current.removeAllListeners();
      }
    }
  }, [namespace, socketEventMap, autoConnect, baseUrl]);

  return [socket?.current, disconnected, reconnecting]
}