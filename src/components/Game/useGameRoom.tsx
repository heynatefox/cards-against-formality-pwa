import { useContext, useState, useEffect, useCallback, useReducer } from "react";
import { useLocation, useNavigate } from "react-router";

import { UserContext } from "../../Contexts/UserProvider";
import useFetchData, { FetchType } from "../../Hooks/useFetchData";
import useSocket from "../../Hooks/useSocket";
import genericReducer from "../../Reducers/genericReducer";
import { SnackbarMessage } from "../../Contexts/SnackbarProvider";

export default function useGameRoom(openSnack: (data: SnackbarMessage | null) => void) {

  const { user } = useContext(UserContext);
  // We need to keep the room state up to date.
  const [res, isLoading, errorMessage, next] = useFetchData(`/api/rooms/join/players`, FetchType.PUT);
  const navigate = useNavigate();
  const location = useLocation();
  const [roomId, setRoomId] = useState<null | string>(null);

  const [spectators, setSpectators] = useState([]);
  const [players, dispatchPlayers] = useReducer(genericReducer, []);
  const [cards, setCards] = useState([]);
  const [room, setRoom] = useState<any>(null);
  const [game, setGame] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [isCzar, setIsCzar] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const onRoomEvent = useCallback(({ updateType, payload }: { updateType: any, payload: any }) => {
    if (updateType === 'removed') {
      navigate('/rooms');
      return;
    }
    setRoom(payload);
  }, [history]);
  const onDealEvent = useCallback((d: any) => setCards(d.payload), []);
  const onGameEvent = useCallback((d: any) => setGame(d.payload), []);
  const [socketMapping] = useState({ room: onRoomEvent, game: onGameEvent, deal: onDealEvent });
  const [socket, disconnected, reconnecting] = useSocket(socketMapping, '/games', false);
  const joinRoom = useCallback((passcode?: string) => {
    if (!user) {
      return;
    }

    const data: any = { roomId, clientId: user._id };
    if (passcode?.length) {
      data.passcode = passcode;
    }
    // reroute to room.
    next(data, true)
      .catch((err) => {
        if (err.response?.status === 404) {
          openSnack({ text: 'Game no longer exists', severity: "error" });
          navigate('/rooms');
          return;
        }
        if (err.response?.status === 401) {
          setShowPasswordDialog(true);
          if (passcode?.length) {
            openSnack({ text: 'Invalid password', severity: "error" })
          }
        }
      });
  }, [roomId, user, next, history, openSnack])

  // check if the player is already in the room. If yes, join it.
  // if the game is password protected, prompt password, or take from url.
  // try join room.
  useEffect(() => {
    const { state, search } = location;
    // if state location is present. Redirect came from joining a room from /rooms.
    if (state) {
      setRoomId((state as any)._id);
    } else if (search) {

      const params = new URLSearchParams(search);
      const roomId = params.get('_id');

      // else show error page... Maybe redirect back to rooms?
      if (roomId) {
        setRoomId(roomId);
      }
    }
  }, [location]);


  useEffect(() => {
    if (user && roomId?.length) {
      // we've got the roomId... Try join the room.
      joinRoom()
    }

    // investigate issue where next causes update, even though it's wrapped in useCallback
  }, [roomId, joinRoom, user]);

  useEffect(() => {
    if (res) {
      setShowPasswordDialog(false);
      setRoom(res);
    }
  }, [res]);

  useEffect(() => {
    if (socket) {
      socket.once('message', (data: any) => {
        if (data.payload?.type?.length && data.payload.type === 'kicked') {
          navigate('/rooms');
          openSnack({ text: 'You have been kicked from the game', severity: 'error' });
        }
      });
    }
  }, [socket, history, openSnack])

  useEffect(() => {
    // once we have a room. We must join the game socket namespace.
    if (room && user) {
      setSpectators(room.spectators);
      // make it so that 'multi_update_Data' dispatch, removes any elements that aren't found in the update array.
      dispatchPlayers({ type: 'MULTI_UPDATE_DATA', data: room.players });
      if (socket && socket.disconnected) {
        socket.connect();
      }

      setIsHost(user._id === room.host);
    }
  }, [room, socket, user]);

  useEffect(() => {
    if (game) {
      setIsCzar(game.czar === user?._id);
      dispatchPlayers({ type: 'MULTI_UPDATE_DATA', data: game.players });
    }
  }, [game, user]);

  return [user?._id, room, isHost, isCzar, game, cards, players, spectators, isLoading, errorMessage, showPasswordDialog, joinRoom, disconnected, reconnecting];
}
