import React, { useState, useCallback } from 'react';
import { IconButton, Card, CardContent, CardHeader, Button, Typography } from "@material-ui/core";
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';

import PasswordDialog from './PasswordDialog';

import './Room.scss';

export default React.memo(({ room, onJoin }: any) => {
  const joinRoom = useCallback((passcode?: string) => onJoin(room._id, passcode), [onJoin, room._id]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function renderPasswordDialog() {
    if (!room.passcode) {
      return null;
    }

    return <PasswordDialog
      onSubmit={joinRoom}
      isDialogOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
    />;
  }

  function renderIcon() {
    if (window.screen.width < 600) {
      return null;
    }

    return <IconButton edge="start" color="secondary" aria-label="menu" disabled={true}>
      {room.passcode ? <Lock /> : <LockOpen />}
    </IconButton>
  }

  return <>
    {renderPasswordDialog()}
    <Card className="room" key={room._id}>
      <CardHeader
        className="room-title"
        title={room.name}
        subheader={`${room.players.length}/${room.options.maxPlayers} Players`}
        avatar={renderIcon()}
        action={
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => { room.passcode ? setIsDialogOpen(true) : joinRoom() }}
            disabled={room.players.length >= room.options.maxPlayers}
          >
            Join Game
        </Button>
        }
      />
      <CardContent className="room-content">
        {room.passcode ? <Typography variant="caption" color="secondary">Private</Typography> : null}
        <Typography color="textSecondary" variant="caption">Status: {room.status}</Typography>
        <Typography color="textSecondary" variant="caption">Target Score: {room.options.target}</Typography>
        <Typography color="textSecondary" variant="caption">Round Time: {room.options.roundTime}s</Typography>
        <Typography color="textSecondary" variant="caption">Number of Decks: {room.options.decks.length}</Typography>
      </CardContent>
    </Card>
  </>;
});
