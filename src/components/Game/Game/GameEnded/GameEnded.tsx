import React, { useMemo, useContext } from 'react';
import { Typography, Button } from '@material-ui/core';
import { UserContext } from '../../../../Contexts/UserProvider';

import './GameEnded.scss';

export default function GameEnded({ game, players }: { game: any, players: any }) {
  const { user } = useContext(UserContext);
  const winners = useMemo(() => {
    return game.winner.map((winner: string) => players.find((player: any) => player._id === winner));
  }, [game, players]);

  return <div className="game-ended-container">
    <Typography variant="h3" className="game-ended-header">
      Game over!
    </Typography>
    <div className="winners-container">
      {winners?.length ? winners.map(({ username, score }: any) => {
        return <Typography variant="h4" key={username}>
          {username === user?.username ? "You win!" : `${username} wins!`} with {score} points
      </Typography>
      }) : null}
    </div>
    <div className="content-wrapper">
      <Typography variant="body1">
        If you enjoyed the game and would like to help keep the servers alive, please consider buying me a coffee.
      </Typography>
      <Button onClick={() => window.open("https://www.buymeacoffee.com/cards")} color="primary" variant="contained">Buy me a coffee</Button>
    </div>
  </div>
}