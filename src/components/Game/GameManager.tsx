import React, { useCallback, useContext } from 'react';
import { Container, Backdrop, CircularProgress, Typography } from '@material-ui/core';

import GameContainer from './GameBorder/GameBorder';
import useGameRoom from './useGameRoom';
import './GameManager.scss';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';
import { RouterContext } from '../../Contexts/RouteProvider';
import Pending from './Pending/Pending';
import Game from './Game/Game'

export default function GameManager() {
  const [clientId, room, isHost, isCzar, game, cards, players, spectators, isLoading, errorMessage] = useGameRoom();

  const [, , , leave] = useFetchData(`https:////api.cardsagainstformality.io/api/rooms/leave`, FetchType.PUT);
  const [, startGameLoading, , startGame] = useFetchData(`https:////api.cardsagainstformality.io/api/games/start`, FetchType.PUT);
  const [, submitCardsLoading, , submitCards] = useFetchData(`https:////api.cardsagainstformality.io/api/games/cards`, FetchType.POST);
  const [, selectWinnerLoading, , selectWinner] = useFetchData(`https:////api.cardsagainstformality.io/api/games/winner`, FetchType.POST);
  const { history } = useContext(RouterContext);
  const onLeave = useCallback(_onLeave, [room, leave, history]);
  const onGameStart = useCallback(_onGameStart, [room, startGame]);
  const onCardsSubmit = useCallback(_onCardsSubmit, [room, submitCards, clientId]);
  const onWinnerSelect = useCallback(_onWinnerSelect, [room, clientId, selectWinner]);


  function _onLeave() {
    leave({ roomId: room?._id })
      .then(() => {
        history.push('/rooms');
      })
      .catch(() => {
        history.push('/rooms');
        // handle toasty error.
      })
  }

  function _onGameStart() {
    startGame({ roomId: room?._id })
      .catch(() => {
        // handle toasty error.
      })
  }

  function _onCardsSubmit(cards: string[]) {
    return submitCards({ roomId: room._id, clientId, cards })
      .then(() => {
          // remove cards from current pick
          // handle error
      })
  }

  function _onWinnerSelect(winnerId: string) {
    return selectWinner({ roomId: room._id, clientId, winnerId })
  }

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

    return <GameContainer key={game?.turn} host={room?.host} czar={game?.czar} roomName={room?.name} players={players} onLeave={onLeave}>
      {room?.status === 'pending' ?
        <Pending isHost={isHost} numberOfPlayers={players.length} startGame={onGameStart} /> :
        <Game cards={cards} players={players} game={game} isCzar={isCzar} onCardsSubmit={onCardsSubmit} onWinnerSelect={onWinnerSelect} />
      }
    </GameContainer>
  }

  return <Container className="game-manager-container" maxWidth="lg">
    {renderMain()}
  </Container>
}
