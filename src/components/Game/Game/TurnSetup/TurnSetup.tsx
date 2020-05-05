import React, { useContext } from 'react';
import { Typography, CircularProgress } from '@material-ui/core';

import Card from '../../../Card/Card';
import { TurnDataWithState } from '../Game';
import './TurnSetup.scss';
import { UserContext } from '../../../../Contexts/UserProvider';

export interface TurnSetupProps {
  game: TurnDataWithState;
  players: any[];
}

export default function TurnSetup({ game, players }: TurnSetupProps) {
  const { user } = useContext(UserContext);
  if (game.turn === 0) {
    return <div className="turn-setup-container">
      <Typography variant="h5">Sacrificing a chicken for your enjoyment</Typography>
      <CircularProgress />
    </div>
  }

  if (!game.winner) {
    return <div className="turn-setup-container">
      <Typography variant="h5">
        {game?.errorMessage?.length ? game.errorMessage : 'Something went very wrong... No one wins!'}
      </Typography>
    </div>;
  }
  const username = players.find(player => player._id === game.winner)?.username;
  return <div className="turn-setup-container">
    <Typography variant="h5">{username === user?.username ? 'You win' : `${username} wins`}!</Typography>
    <div className="winning-cards">
      {game.winningCards.map(card => <Card key={card._id + 'user-selection'} card={card} />).reverse()}
    </div>
  </div>;
}
