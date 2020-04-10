import { useContext, useState, useEffect } from "react";

import { UserContext } from "../../Contexts/UserProvider";
import useFetchData, { FetchType } from "../../Hooks/useFetchData";
import { RouterContext } from "../../Contexts/RouteProvider";

export default function useGameRoom() {
  const { user } = useContext(UserContext);
  const [room, setRoom] = useState<any>(null);
  const [res, isLoading, errorMessage, next] = useFetchData('http://localhost/api/rooms/join/players', FetchType.PUT);
  const { location: { search, state } } = useContext(RouterContext);
  const [roomId, setRoomId] = useState<null | string>(null);

  // check if the player is already in the room. If yes, join it.
  // if the game is password protected, prompt password, or take from url.
  // try join room.
  useEffect(() => {
    // if state location is present. Redirect came from joining a room from /rooms.
    if (state) {
      setRoom(state);
      return;
    }

    if (search) {
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
      next(data, true)
        .catch((err) => {

        });
    }


    // investigate issue where next causes update, even though it's wrapped in useCallback
  }, [roomId, next, user]);

  useEffect(() => {
    if (res) {
      setRoom(res);
    }
  }, [res]);

  return [room, isLoading, errorMessage];
}
