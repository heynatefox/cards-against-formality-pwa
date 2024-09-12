import { useState, useEffect, useRef, useContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

import ConfigContext from '../Contexts/ConfigContext';
import { FirebaseContext } from '../Contexts/FirebaseProvider';

export interface SocketEventMap {
  [eventName: string]: (data: any) => void,
}


export default function useSocket(
  socketEventMap: SocketEventMap, namespace: string = '/', autoConnect: boolean = true
): [Socket | null, boolean, boolean] {
  const [reconnecting, setReconnecting] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { baseUrl } = useContext(ConfigContext);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    if (firebase) {
      const auth = getAuth(firebase);
      let active = true;
      auth.currentUser?.getIdToken()
        .then((token) => {
          if (active) {
            setSocket(io(`${baseUrl}${namespace}`, {
              transports: ['websocket'],
              path: '/socket',
              autoConnect,
              reconnection: true,
              reconnectionDelay: 500,
              query: {
                auth: token
              },
            }));
          }
        });
      return () => {
        active = false;
      }
    }
  }, [firebase, namespace, socketEventMap, autoConnect, baseUrl]);

  useEffect(() => {
    let disconnectedTimeout: number | null;

    if (socket) {
      socket.on('connect', function () {
        if (disconnectedTimeout) {
          clearTimeout(disconnectedTimeout);
          disconnectedTimeout = null;
        }
        setReconnecting(false);
        setDisconnected(false);
      });

      socket.on('disconnect', () => {
        disconnectedTimeout = setTimeout(() => {
          setDisconnected(true);
        }, 1000);
      })

      socket.on('reconnecting', () => {
        setReconnecting(true);
      });

      Object.entries(socketEventMap).forEach(([eventName, onEvent]) => {
        socket.on(eventName, onEvent);
      });

      // Only connect if auto correct is true. Else let the hooks user decided.
      if (autoConnect && socket.disconnected) {
        socket.connect()
      }
    }

    return () => {
      if (disconnectedTimeout) {
        clearTimeout(disconnectedTimeout);
      }
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
    };
  }, [socket])

  return [socket, disconnected, reconnecting]
}