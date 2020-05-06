import React, { useState, useCallback } from 'react';
import { IconButton, Card, CardContent, CardHeader, Button } from "@material-ui/core";
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

  return <>
    {renderPasswordDialog()}
    <Card className="room" key={room._id}>
      <CardHeader
        className="room-title"
        title={room.name}
        subheader={`${room.players.length}/${room.options.maxPlayers} Players, Status: ${room.status}`}
        avatar={
          <IconButton edge="start" color="secondary" aria-label="menu" disabled={true}>
            {room.passcode ? <Lock /> : <LockOpen />}
          </IconButton>
        }
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
      <CardContent>
        {/* <div>hello</div> */}
      </CardContent>
    </Card>
  </>;
});
