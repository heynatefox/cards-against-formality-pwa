import { useContext, useState, useEffect, useCallback, useReducer } from "react";

import { UserContext } from "../../Contexts/UserProvider";
import useFetchData, { FetchType } from "../../Hooks/useFetchData";
import { RouterContext } from "../../Contexts/RouteProvider";
import useSocket from "../../Hooks/useSocket";
import genericReducer from "../../Reducers/genericReducer";

export default function useGameRoom() {
  const { user, token } = useContext(UserContext);
  // We need to keep the room state up to date.
  const [res, isLoading, errorMessage, next] = useFetchData('http://localhost/api/rooms/join/players', FetchType.PUT);
  const { location: { search, state } } = useContext(RouterContext);
  const [roomId, setRoomId] = useState<null | string>(null);

  const [spectators, setSpectators] = useState([]);
  const [players, dispatchPlayers] = useReducer(genericReducer, []);
  const [cards, setCards] = useState([]);
  const [room, setRoom] = useState<any>(null);
  const [game, setGame] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);

  const onRoomEvent = useCallback(d => setRoom(d.payload), []);
  const onDealEvent = useCallback(d => setCards(d.payload), []);
  const onGameEvent = useCallback(d => setGame(d.payload), []);
  const [socketMapping] = useState({ room: onRoomEvent, game: onGameEvent, deal: onDealEvent });
  const [socket] = useSocket(token, socketMapping, '/games', false);

  // check if the player is already in the room. If yes, join it.
  // if the game is password protected, prompt password, or take from url.
  // try join room.
  useEffect(() => {
    // if state location is present. Redirect came from joining a room from /rooms.
    if (state) {
      setRoom(state);
    } else if (search) {

      const params = new URLSearchParams(search);
      const roomId = params.get('_id');

      // else show error page... Maybe redirect back to rooms?
      if (roomId) {
        setRoomId(roomId);
      }
    }
  }, [search, state]);


  useEffect(() => {
    if (user && roomId?.length) {
      // we've got the roomId... Try join the room. If 401. Prompt password dialog.
      const data: any = { roomId, clientId: user._id };
      // reroute to room.
      console.log('fetching room')
      next(data, true)
        .catch((err) => {

        });
    }

    // investigate issue where next causes update, even though it's wrapped in useCallback
  }, [roomId, next, user]);

  // WARNING: This only happens if the user joined by a link
  useEffect(() => {
    if (res) {
      setRoom(res);
    }
  }, [res]);

  useEffect(() => {
    // once we have a room. We must join the game socket namespace.
    if (room && user) {
      setSpectators(room.spectators);
      dispatchPlayers({ type: 'MULTI_UPDATE_DATA', data: room.players });
      if (socket && socket.disconnected) {
        socket.connect();
        console.log(room);
      }

      console.log('testing if is host', user._id, room.host)
      setIsHost(user._id === room.host);
    }
  }, [room, socket, user]);

  useEffect(() => {
    if (game) {
      dispatchPlayers({ type: 'MULTI_UPDATE_DATA', data: game.players });
    }
  }, [game]);

  // dev purposes.
  useEffect(() => {
    console.log(players);
  }, [players]);

  return [room, isHost, game, cards, players, spectators, isLoading, errorMessage];
}
