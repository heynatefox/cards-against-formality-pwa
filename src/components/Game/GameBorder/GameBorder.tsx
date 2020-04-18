import React from 'react';
import { Card, CardHeader, CardContent, Button } from "@material-ui/core";

import Players from './PlayersContainer';
import './GameBorder.scss';

export interface GameBorderProps {
  host: string;
  children: React.ReactNode;
  players: any[];
  roomName: string;
  onLeave: () => void;
}

export default React.memo(({ roomName, host, players, children, onLeave }: GameBorderProps) => {
  return <Card raised={true} className="game-border-container">
    <CardHeader
      className="header"
      title={roomName}
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
      {/* <div className="game-container-content"> */}
        <div className="game-container-children-wrapper">
          {children}
        </div>
        <div className="players-container">
          <Players players={players} host={host} />
        </div>
      {/* </div> */}
    </CardContent>
  </Card>
});
