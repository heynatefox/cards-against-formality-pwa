import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, CardHeader, CardContent, Card, IconButton } from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ShareIcon from '@material-ui/icons/Share';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Card as CardInterface} from '../Game/Game';
import CardSelector from '../CardSelector/CardSelector';
import GameCard from '../../Card/Card';
import Players from './PlayersContainer';
import './GameBorder.scss';
import { GameState } from '../Game/Game';
import { SnackbarMessage } from '../../../Contexts/SnackbarProvider';

export interface GameBorderProps {
  host: string;
  children: React.ReactNode;
  players: any[];
  roomName: string;
  room: any;
  onLeave: () => void;
  cards: CardInterface[];
  isCzar: boolean;
  onCardsSubmit: (cards: string[]) => Promise<any>;
  game: any;
  isHost: boolean;
  openSnack: (data: SnackbarMessage | null) => void;
}

function GameBorderSubHeader({ game, isHost, room }: { game: any, isHost: boolean, room: any }) {

  const [timeObj, setTimeObj] = useState(() => {
    if (game?.state === GameState.PICKING_CARDS || game?.state === GameState.SELECTING_WINNER) {
      const nowTime = new Date().getTime();
      const timer = room.options?.roundTime;
      return { startTime: nowTime, endTime: nowTime + (timer * 1000), timer };
    }
    return null;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeObj(prevTimer => {
        if (!prevTimer) {
          return prevTimer;
        }

        const nowTime = new Date().getTime();
        return Object.assign({}, prevTimer, { timer: Math.ceil((nowTime - prevTimer.endTime) * -0.001) });
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);


  if (!game) {
    return <span>{isHost ? 'Start the game when everyone is ready' : 'Waiting for game to start'}</span>;
  }

  return <div className="sub-header-container">
    <span className="round-number">Round {game.turn}</span>
    {timeObj && timeObj.timer > 0 ? <><span className="timer">{timeObj?.timer}</span><AccessTimeIcon /></> : null}
  </div>
}

export default React.memo(({ roomName, host, isHost, players, children, onLeave, cards, onCardsSubmit, isCzar, game, openSnack, room }: GameBorderProps) => {
  const [maxChildHeight, setMaxChildHeight] = useState(0);
  const leftContent = useRef<any>();
  const onShare = useCallback((e: any) => {
    const data = {
      title: 'Cards Against Formality',
      text: `You've been invited to join a game!`,
      url: window.location.href,
    };
    if ('canShare' in navigator && (navigator as any)?.canShare(data)) {
      (navigator as any).share(data)
        .then(() => openSnack({ text: 'Game invite sent!', severity: 'success' }))
        .catch(() => { });
      return;
    }

    const dummy = document.createElement('input'),
      text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    openSnack({ text: 'Link copied to clipboard!', severity: 'success' });
  }, [openSnack])

  useEffect(() => {
    const listener = () => {
      if (leftContent?.current) {
        const { height } = (leftContent as any).current.getBoundingClientRect();
        setMaxChildHeight(window.screen.width < 600 ? height - 160 : height);
      }
    }
    listener();
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    }
  }, []);

  function renderActionButton() {
    if (window.screen.width < 600) {
      return <>
        <IconButton onClick={onShare} title="Invite your friends!">
          <ShareIcon color="action" />
        </IconButton>
        <IconButton
          className="leave-button-mb"
          color="secondary"
          onClick={onLeave}
        >
          <ExitToAppIcon />
        </IconButton>
      </>

    }

    return <Button
      // handle leaving room.
      onClick={onLeave}
      className="leave-button"
      variant="outlined"
      color="secondary"
      size="medium"
      endIcon={null}
    >
      Leave Room
  </Button>;
  }

  const title = <>
    <span>{roomName} Game</span>
    <IconButton onClick={onShare} title="Invite your friends!">
      <ShareIcon color="action" />
    </IconButton>
  </>;

  return <Card raised={true} className="game-border-container">
    <CardHeader
      className="header"
      titleTypographyProps={{ color: 'secondary' }}
      title={window.screen.width > 600 ? title : null}
      subheader={<GameBorderSubHeader game={game} isHost={isHost} room={room} />}
      action={renderActionButton()}
    />
    <CardContent className="game-container-content">
      <div className="left-content" ref={leftContent}>

        <div className="top-content">
          <div className="black-card-container">
            {game?.blackCard && game?.state !== GameState.ENEDED ? <GameCard card={game.blackCard} className="master-black-card" /> : null}
          </div>

          <div className="game-container-children-wrapper" style={{ maxHeight: maxChildHeight }}>
            {React.Children.map(children, (child: any) => {
              if (!child || !React.isValidElement(child)) {
                return null;
              }

              return React.cloneElement(child, { maxChildHeight } as any);
            })}
          </div>
        </div>

        <div className="card-selector-container">
          {game?.state !== GameState.PICKING_CARDS ? null : <CardSelector pick={game?.blackCard?.pick} state={game?.state} cards={cards} onCardsSubmit={onCardsSubmit} isCzar={isCzar} />}
        </div>
      </div>
      <div className="players-container">
        <Players players={players} host={host} czar={game?.czar} roomId={room?._id} isCurrentUserHost={isHost} />
      </div>
    </CardContent>
  </Card >
});
