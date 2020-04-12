import React from "react";
import { Card, CardContent, Typography, Paper } from "@material-ui/core";

interface PlayersProps {
  players: any[];
  host: string;
}

const Player = React.memo(({ player, isHost }: any) => {
  return <Card raised={true} className="player-container">
    <CardContent>
      <Typography variant="body1">
        {isHost ? 'host: ' : null}
        {player.displayName}
      </Typography>
      {player?.score >= 0 ? <Typography variant="body2" color="textSecondary">
        Score: {player.score}
      </Typography> : null}
    </CardContent>
  </Card>
});

const Players = React.memo(({ players, host }: PlayersProps) => {
  return <Paper className="players-list" elevation={3}>
    {players.map(player => <Player key={player._id} player={player} isHost={player._id === host} />)}
  </Paper>;
});

export default Players;
