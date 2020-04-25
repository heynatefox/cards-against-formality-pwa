import React, { useCallback, useContext } from 'react';
import { Container, Backdrop, CircularProgress } from '@material-ui/core';

import GameContainer from './GameBorder/GameBorder';
import useGameRoom from './useGameRoom';
import './GameManager.scss';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';
import { RouterContext } from '../../Contexts/RouteProvider';
import Pending from './Pending/Pending';
import Game from './Game/Game'
import PasswordDialog from '../Rooms/Room/PasswordDialog';

export default function GameManager() {
  const [clientId, room, isHost, isCzar, game, cards, players, , isLoading, , showPasswordDialog, joinRoom] = useGameRoom();

  const [, , , leave] = useFetchData(`/api/rooms/leave`, FetchType.PUT);
  const [, , , startGame] = useFetchData(`/api/games/start`, FetchType.PUT);
  const [, , , submitCards] = useFetchData(`/api/games/cards`, FetchType.POST);
  const [, , , selectWinner] = useFetchData(`/api/games/winner`, FetchType.POST);
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
    if (isLoading || showPasswordDialog) {
      // Joining room.
      return <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    }

    return <GameContainer key={game?.turn} host={game?.host} isHost={isHost} roomName={room?.name} players={players} onLeave={onLeave} cards={cards} isCzar={isCzar} onCardsSubmit={onCardsSubmit} game={game}>
      {room?.status === 'pending' ?
        <Pending isHost={isHost} numberOfPlayers={players.length} startGame={onGameStart} room={room} /> :
        <Game players={players} game={game} isCzar={isCzar} onWinnerSelect={onWinnerSelect} />
      }
    </GameContainer>
  }

  return <Container className="game-manager-container" maxWidth="xl">
    {renderMain()}
    {showPasswordDialog ? <PasswordDialog isDialogOpen={true} onSubmit={joinRoom} /> : null}
  </Container>
}
