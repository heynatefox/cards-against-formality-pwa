import { useReducer, useEffect, useCallback, useState, } from "react";

import RoomsReducer from "../Reducers/genericReducer";
import useFetchData from "./useFetchData";
import useSocket from "./useSocket";

export default function useRooms(): [any[], boolean, boolean, boolean] {

  const [rooms, dispatch] = useReducer(RoomsReducer, []);

  const onEvent = useCallback(({ payload, updateType }: any) => {
    switch (updateType) {
      case 'created':
        dispatch({ type: 'ADD_DATA', data: payload })
        break;
      case 'updated':
        dispatch({ type: 'UPDATE_DATA', data: payload })
        break;
      case 'removed':
        dispatch({ type: 'REMOVE_DATA', data: payload })
        break;
      default:
        break;
    }
  }, []);
  const [socketMapping] = useState({ rooms: onEvent });

  const [, disconnected, reconnecting] = useSocket(socketMapping, '/rooms');
  // TODO: implement infinite scrolling.
  const [res, isLoading] = useFetchData<{ rows: any[] }>(`/api/rooms?pageSize=100`);

  useEffect(() => {
    if (res) {
      dispatch({ type: 'MULTI_ADD_DATA', data: res.rows })
    }
  }, [res]);

  return [rooms, isLoading, disconnected, reconnecting];
}