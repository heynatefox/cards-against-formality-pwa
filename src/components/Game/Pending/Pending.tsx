import React from 'react';
import { Button, CircularProgress } from "@material-ui/core";
import Card from '../../Card/Card';

import './Pending.scss';

export interface PendingProps {
  isHost: boolean;
  numberOfPlayers: number;
  startGame: () => void;
  room: any;
}
const Pending = React.memo(({ isHost, numberOfPlayers, startGame, room }: PendingProps) => {

  function renderStartButton() {
    if (!isHost) {
      return <CircularProgress color="inherit" />;
    }

    return <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={startGame}
      disabled={numberOfPlayers < 2}
      className="start-button"
    >
      Start Game!
    </Button>;
  }


  const { maxPlayers, maxSpectators, target } = room?.options;
  const text = isHost ? 'Start the game when everyone is ready _' : 'Waiting for the host to start the game _';
  return <div className="pending-container">
    <div className="card-group">
      <Card className="first-card" card={{ cardType: 'black', _id: '1', text, pick: 1 }}>
        {renderStartButton()}
      </Card>
      <Card className="second-card" card={{ cardType: 'white', _id: '2', text: `Game Options` }}>
        <span className="word">Max Players: {maxPlayers}</span>
        <span className="word">Max Spectators: {maxSpectators}</span>
        <span className="word">Target Score: {target}</span>
      </Card>
    </div>
  </div >
});

export default Pending;
