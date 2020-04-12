import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from "@material-ui/core";

export interface PendingProps {
  isHost: boolean;
  numberOfPlayers: number;
  startGame: () => void;
}

const Pending = React.memo(({ isHost, numberOfPlayers, startGame }: PendingProps) => {

  function renderStartButton() {
    if (!isHost) {
      return null;
    }

    return <CardActions>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={startGame}
        disabled={numberOfPlayers < 2}
      >
        Start Game!
    </Button>
    </CardActions>;
  }

  return <Card>
    {renderStartButton()}
    <CardContent>
      <Typography>
        Waiting host the host to start the game...
      </Typography>
      <div>Display the game options here...</div>
    </CardContent>
  </Card>
});

export default Pending;
