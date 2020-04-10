import React, { useState, useCallback } from 'react';
import { IconButton, Card, CardContent, CardHeader, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@material-ui/core";
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';

import './Room.scss';

function PasscodeDialog({ isDialogOpen, onClose, onSubmit }: any) {
  const [password, setPassword] = useState('');

  return <Dialog open={isDialogOpen} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Password Required</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Enter the correct password for entry.
        </DialogContentText>
      <TextField
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoFocus
        margin="dense"
        id="password"
        label="Password"
        type="password"
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={onClose}>
        Cancel
        </Button>
      <Button onClick={() => onSubmit(password)} color="primary">
        Submit
        </Button>
    </DialogActions>
  </Dialog>
}

export function Room({ room, onJoin }: any) {
  const joinRoom = useCallback((passcode?: string) => onJoin(room._id, passcode), [onJoin, room._id]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  function renderPadlock(passcode: string) {
    return <IconButton edge="start" color="secondary" aria-label="menu" disabled={true}>
      {passcode ? <Lock /> : <LockOpen />}
    </IconButton>
  }

  function renderAction() {
    return <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={() => { room.passcode ? setIsDialogOpen(true) : joinRoom() }}
      disabled={room.players.length >= room.options.maxPlayers}
    >
      Join Room
    </Button>;
  }

  function renderPasscodeDialog() {
    if (!room.passcode) {
      return null;
    }

    return <PasscodeDialog
      onSubmit={joinRoom}
      isDialogOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
    />;
  }

  return <>
    {renderPasscodeDialog()}
    <Card className="room" key={room._id}>
      <CardHeader
        className="room-title"
        title={room.name}
        subheader={`${room.players.length}/${room.options.maxPlayers} Players, Status: ${room.status}`}
        avatar={renderPadlock(room.passcode)}
        action={renderAction()}
      />
      <CardContent>
        {/* <div>hello</div> */}
      </CardContent>
    </Card>
  </>;
}
