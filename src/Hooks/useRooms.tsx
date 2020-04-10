import { useReducer, useEffect, } from "react";
import io from 'socket.io-client';

import RoomsReducer from "../components/Rooms/RoomsReducer";
import useFetchData from "./useFetchData";

export default function useRooms(token: string): [any[], boolean] {

  const [rooms, dispatch] = useReducer(RoomsReducer, []);

  useEffect(() => {
    let socket: SocketIOClient.Socket;
    if (token?.length) {
      socket = io('localhost/rooms', {
        transports: ['websocket'],
        path: '/socket',
        autoConnect: false,
        query: {
          auth: token
        }
      });

      socket.on('rooms', ({ payload, updateType }: any) => {
        switch (updateType) {
          case 'created':
            dispatch({ type: 'ADD_ROOM', data: payload })
            break;
          case 'updated':
            dispatch({ type: 'UPDATE_ROOM', data: payload })
            break;
          case 'removed':
            dispatch({ type: 'REMOVED_ROOM', data: payload })
            break;
          default:
            break;
        }
      });

      socket.connect()
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
    }
  }, [token]);

  // TODO: implement infinite scrolling.
  const [res, isLoading] = useFetchData<{ rows: any[] }>('http://localhost/api/rooms?pageSize=100');

  useEffect(() => {
    if (res) {
      // investigate why this is called twice. Might just be a dev thing.
      dispatch({ type: 'MULTI_ADD_ROOMS', data: res.rows })
    }
  }, [res]);

  return [rooms, isLoading];
}