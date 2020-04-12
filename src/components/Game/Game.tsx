import React, { useCallback, useContext, useEffect } from 'react';
import { Container, Backdrop, CircularProgress, Typography } from '@material-ui/core';

import GameContainer from './GameContainer';
import useGameRoom from './useGameRoom';
import './Game.scss';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';
import { RouterContext } from '../../Contexts/RouteProvider';
import Pending from './Pending';

export default function Game() {
  const [room, isHost, game, cards, players, spectators, isLoading, errorMessage] = useGameRoom();

  const [, , , leave] = useFetchData('http://localhost/api/rooms/leave', FetchType.PUT);
  const [, , , startGame] = useFetchData('http://localhost/api/games/start', FetchType.PUT);
  const { history } = useContext(RouterContext);
  const onLeave = useCallback(_onLeave, [room, leave, history]);
  const onGameStart = useCallback(_onGameStart, [room, startGame]);


  function _onLeave() {
    leave({ roomId: room._id })
      .then(() => {
        history.push('/rooms');
      })
      .catch(() => {
        // handle toasty error.
      })
  }

  function _onGameStart() {
    startGame({ roomId: room._id })
      .catch(() => {
        // handle toasty error.
      })
  }

  useEffect(() => {
    console.log(game);
  }, [game]);

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  function renderMain() {
    if (isLoading) {
      // Joining room.
      return <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    }

    if (!isLoading && errorMessage?.length) {
      return <div>
        <Typography className="title" variant="h2">
          {errorMessage}
        </Typography>
      </div>;
    }

    return <GameContainer host={room?.host} roomName={room?.name} players={players} onLeave={onLeave}>
      {room?.status === 'pending' ? <Pending isHost={isHost} numberOfPlayers={players.length} startGame={onGameStart} /> : null}
    </GameContainer>
  }

  return <Container className="game-container">
    {renderMain()}
  </Container>
}
