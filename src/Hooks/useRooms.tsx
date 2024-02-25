import { useReducer, useEffect, useCallback, useState, useRef } from "react";

import PaginationReducer from "../Reducers/paginationReducer";
import useFetchData from "./useFetchData";
import useSocket from "./useSocket";
import { UsePaginationProps, usePagination } from "@material-ui/lab";

interface Room {
  _id: string;
  name: string;
  options: {
    target: number;
    maxPlayers: number;
    maxSpectators: number;
    decks: string[];
    roundTime: number;
  };
  players: string[];
  host: string;
  spectators: string[];
  status: string;
}

const PAGE_SIZE = 2;
export default function useRooms() {
  const [rooms, dispatch] = useReducer(PaginationReducer<Room>, []);
  const roomsRef = useRef(rooms);
  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!rooms.length && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [rooms]);

  const onEvent = useCallback(({ payload, updateType }: any) => {
    switch (updateType) {
      case "created":
        if (roomsRef.current.length !== PAGE_SIZE) {
          dispatch({ type: "ADD_DATA", data: payload });
        } else {
          setPaginationProps((prev) => {
            if (prev) {
              return { ...prev, count: prev.count! + 1 };
            }
            return prev;
          });
        }
        break;
      case "updated":
        dispatch({ type: "UPDATE_DATA", data: payload });
        break;
      case "removed":
        dispatch({ type: "REMOVE_DATA", data: payload });
        // if we remove a room and we're on the last page, we need to fetch the previous page
        break;
      default:
        break;
    }
  }, []);

  const [socketMapping] = useState({ rooms: onEvent });

  const [, disconnected, reconnecting] = useSocket(socketMapping, "/rooms");

  const [res, isLoading] = useFetchData<{
    rows: Room[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>(`/api/rooms?pageSize=${PAGE_SIZE}&page=${page}`);

  const [paginationProps, setPaginationProps] =
    useState<UsePaginationProps | null>(null);

  const onPageChange = useCallback((_, page: number) => {
    setPage(page);
  }, []);

  useEffect(() => {
    if (res) {
      dispatch({ type: "MULTI_ADD_DATA", data: res.rows });

      setPaginationProps({
        count: res.totalPages,
        page: res.page,
        onChange: onPageChange,
        defaultPage: 1,
      });
    }
  }, [res, onPageChange]);

  return { rooms, isLoading, disconnected, reconnecting, paginationProps };
}
