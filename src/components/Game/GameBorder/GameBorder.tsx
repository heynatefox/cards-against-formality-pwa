import React, { useState, useEffect } from 'react';
import { Button, CardHeader, CardContent, Card } from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import CardSelector from '../CardSelector/CardSelector';
import GameCard from '../../Card/Card';
import Players from './PlayersContainer';
import './GameBorder.scss';

interface Card {
  _id: string;
  text: string;
  cardType: 'white' | 'black';
  pick?: number;
}

export interface GameBorderProps {
  host: string;
  children: React.ReactNode;
  players: any[];
  roomName: string;
  onLeave: () => void;
  cards: Card[];
  isCzar: boolean;
  onCardsSubmit: (cards: string[]) => Promise<any>;
  game: any;
  isHost: boolean;
}

function GameBorderSubHeader({ game, isHost }: { game: any, isHost: boolean }) {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, [game])


  if (!game) {
    return <span>{isHost ? 'Start the game when everyone is ready' : 'Waiting for game to start'}</span>;
  }

  return <div className="sub-header-container">
    <span className="round-number">Round {game.turn}</span>
    {timer > 0 ? <><span className="timer">{timer}</span><AccessTimeIcon /></> : null}
  </div>
}

export default React.memo(({ roomName, host, isHost, players, children, onLeave, cards, onCardsSubmit, isCzar, game }: GameBorderProps) => {

  return <Card raised={true} className="game-border-container">
    <CardHeader
      className="header"
      titleTypographyProps={{ color: 'secondary' }}
      title={`${roomName} room`}
      subheader={<GameBorderSubHeader game={game} isHost={isHost} />}
      action={
        <Button
          // handle leaving room.
          onClick={onLeave}
          className="leave-button"
          variant="outlined"
          color="secondary"
          size="medium"
          endIcon={null}
        >
          Leave Room
        </Button>
      }
    />
    <CardContent className="game-container-content">
      <div className="left-content">

        <div className="top-content">
          <div className="black-card-container">
            {game?.blackCard ? <GameCard card={game.blackCard} className="master-black-card" /> : null}
          </div>

          <div className="game-container-children-wrapper">
            {children}
          </div>
        </div>

        <div className="card-selector-container">
          <CardSelector cards={cards} onCardsSubmit={onCardsSubmit} isCzar={isCzar} />
        </div>
      </div>
      <div className="players-container">
        <Players players={players} host={host} czar={game?.czar} />
      </div>
    </CardContent>
  </Card >
});
