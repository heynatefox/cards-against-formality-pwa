import React, { useCallback, useContext } from 'react';
import { Typography, Container, Backdrop, CircularProgress, Button } from '@material-ui/core';

import GameContainer from './GameBorder/GameBorder';
import useGameRoom from './useGameRoom';
import './GameManager.scss';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';
import { RouterContext } from '../../Contexts/RouteProvider';
import Pending from './Pending/Pending';
import Game from './Game/Game'
import PasswordDialog from '../Rooms/Room/PasswordDialog';
import { SnackbarContext } from '../../Contexts/SnackbarProvider';
import GenericGardGroup from '../GenericCardGroup/GenericCardGroup';

export default function GameManager() {
  const { openSnack } = useContext(SnackbarContext);
  const [clientId, room, isHost, isCzar, game, cards, players, , isLoading, , showPasswordDialog, joinRoom, disconnected, reconnecting] = useGameRoom(openSnack);
  const [, , , leave] = useFetchData(`/api/rooms/leave`, FetchType.PUT);
  const [, , , startGame] = useFetchData(`/api/games/start`, FetchType.PUT);
  const [, , , submitCards] = useFetchData(`/api/games/cards`, FetchType.POST);
  const [, , , selectWinner] = useFetchData(`/api/games/winner`, FetchType.POST);
  const { history } = useContext(RouterContext);
  const onLeave = useCallback(_onLeave, [room, leave, history]);
  const onGameStart = useCallback(_onGameStart, [room, startGame, openSnack]);
  const onCardsSubmit = useCallback(_onCardsSubmit, [room, submitCards, clientId, openSnack]);
  const onWinnerSelect = useCallback(_onWinnerSelect, [room, clientId, selectWinner, openSnack]);


  function _onLeave() {
    leave({ roomId: room?._id })
      .then(() => {
        (window as any)?.gtag('event', 'game_leave');
        history.push('/rooms');
      })
      .catch(() => {
        history.push('/rooms');
        // handle toasty error.
      })
  }

  function _onGameStart() {
    startGame({ roomId: room?._id })
      .then(() => {
        (window as any)?.gtag('event', 'game_started');
      })
      .catch((err) => {
        openSnack({ text: err?.response?.data?.message, severity: 'error' });
      })
  }

  function _onCardsSubmit(cards: string[]) {
    return submitCards({ roomId: room._id, clientId, cards })
      .then((res) => {
        (window as any)?.gtag('event', 'cards_selected', { value: cards.length });
        return res;
      })
      .catch(err => {
        openSnack({ text: err?.response?.data?.message, severity: 'error' });
      })
  }

  function _onWinnerSelect(winnerId: string) {
    return selectWinner({ roomId: room._id, clientId, winnerId })
      .then(res => {
        (window as any)?.gtag('event', 'winner_selected');
        return res;
      })
      .catch(err => {
        openSnack({ text: err?.response?.data?.message, severity: 'error' });
        return null;
      })
  }

  function renderMain() {
    if (isLoading || showPasswordDialog) {
      // Joining room.
      return <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    }

    return <GameContainer key={game?.state} host={room?.host} isHost={isHost} roomName={room?.name} players={players} onLeave={onLeave} cards={cards} isCzar={isCzar} onCardsSubmit={onCardsSubmit} game={game} room={room} openSnack={openSnack}>
      {room?.status === 'pending' ?
        <Pending isHost={isHost} numberOfPlayers={players.length} startGame={onGameStart} room={room} /> :
        <Game players={players} game={game} isCzar={isCzar} onWinnerSelect={onWinnerSelect} />
      }
    </GameContainer>
  }

  if (disconnected || reconnecting) {

    return <div className="game-disconnected">
      <GenericGardGroup
        leftCardText="Game Disconnected!"
        leftCardChild={
          reconnecting ? <Typography className="reconnecting-typog"> Reconnecting<CircularProgress /></Typography> : <Button color="secondary" variant="contained" onClick={() => history.push('/login')}>Reconnect</Button>
        }
        rightCardText="Ensure you do not have more than one instance of the game open."
      />
    </div>
  }

  return <Container className="game-manager-container" maxWidth="xl">
    {renderMain()}
    {showPasswordDialog ? <PasswordDialog isDialogOpen={true} onSubmit={joinRoom} onClose={() => history.push('/rooms')} /> : null}
  </Container>
}
