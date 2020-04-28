import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';

import Card from '../../../Card/Card';
import { TurnDataWithState } from '../Game';
import './TurnSetup.scss';

export interface TurnSetupProps {
  game: TurnDataWithState;
  players: any[];
}

export default function TurnSetup({ game, players }: TurnSetupProps) {

  if (game.turn === 0) {
    return <div className="turn-setup-container">
      <Typography variant="h5">Sacrificing a chicken for your enjoyment</Typography>
      <CircularProgress />
    </div>
  }

  if (!game.winner) {
    return <div className="turn-setup-container">
      <Typography variant="h5">
        No one selected any cards. Everyone loses!
      </Typography>
    </div>;
  }

  return <div className="turn-setup-container">
    <Typography variant="h5">{players.find(player => player._id === game.winner)?.username} wins!</Typography>
    <div className="winning-cards">
      {game.winningCards.map(card => <Card key={card._id + 'user-selection'} card={card} />).reverse()}
    </div>
  </div>;
}
