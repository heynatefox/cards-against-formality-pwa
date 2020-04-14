import React from 'react';
import { Typography, CardActions, Button } from "@material-ui/core";

import './Pending.scss';

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

  return <div className="pending-container">
    {renderStartButton()}
    <Typography>
      Waiting host the host to start the game...
    </Typography>
    <div>Display the game options here...</div>
  </div>
});

export default Pending;
