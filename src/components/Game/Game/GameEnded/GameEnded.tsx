import React, { useMemo } from 'react';
import { Typography } from '@material-ui/core';

export default function GameEnded({ game, players }: { game: any, players: any }) {
  const winners = useMemo(() => {
    return game.winner.map((winner: string) => players.find((player: any) => player._id === winner));
  }, [game, players]);

  return <div className="game-ended-container">
    <Typography variant="h2">
      Game over!
    </Typography>
    {winners?.length ? winners.map(({ username, score }: any) => {
      return <Typography variant="h3">
        {username} wins! with {score} points
      </Typography>
    }) : null}
  </div>
}