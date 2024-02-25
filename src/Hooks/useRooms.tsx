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

const PAGE_SIZE = 12;
export default function useRooms() {
  const [rooms, dispatch] = useReducer(PaginationReducer<Room>, []);
  const roomsRef = useRef(rooms);
  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);
  const [page, setPage] = useState(1);

  const onEvent = useCallback(({ payload, updateType }: any) => {
    const updateTotalRoomCount = (num: number) => {
      setPaginationProps((prev) => {
        if (prev) {
          const newTotal = prev.total + num;
          return {
            ...prev,
            total: newTotal,
            count: Math.ceil(newTotal / PAGE_SIZE),
          };
        }
        return null;
      });
    };

    switch (updateType) {
      case "created":
        // +1 to the total room count
        updateTotalRoomCount(1);

        const isPageFull = roomsRef.current.length % PAGE_SIZE === 0;
        // if our page is not full we can just add the data
        if (!isPageFull) {
          dispatch({ type: "ADD_DATA", data: payload });
          return;
        }
        break;
      case "updated":
        dispatch({ type: "UPDATE_DATA", data: payload });
        break;
      case "removed":
        // if we remove a room and we're on the last page, we need to fetch the previous page
        dispatch({ type: "REMOVE_DATA", data: payload });
        // -1 to the total room count
        updateTotalRoomCount(-1);

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

  const [paginationProps, setPaginationProps] = useState<
    (UsePaginationProps & { total: number }) | null
  >(null);

  useEffect(() => {
    // if our current page is greater than the total count of pages
    // go back a page
    if (paginationProps?.count && page > paginationProps.count) {
      setPage((prev) => prev - 1);
    }
  }, [paginationProps, page]);

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
        total: res.total,
      });
    }
  }, [res, onPageChange]);

  return { rooms, isLoading, disconnected, reconnecting, paginationProps };
}
