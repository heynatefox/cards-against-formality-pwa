import React from "react";
import { Typography } from "@material-ui/core";

interface PlayersProps {
  players: any[];
  host: string;
}

const Player = React.memo(({ player, isHost }: any) => {
  return <div className="player-container">
    <Typography variant="body1">
      {player.username}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      Score: {!player?.score ? 0 : player.score}
    </Typography>
  </div>
});

const Players = React.memo(({ players, host }: PlayersProps) => {
  return <div className="players-list">
    {players.map(player => <Player key={player._id} player={player} isHost={player._id === host} />)}
  </div>;
});

export default Players;
