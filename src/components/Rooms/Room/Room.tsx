import React, { useState } from 'react';
import { IconButton, Card, CardContent, CardHeader, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@material-ui/core";
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';
import useFetchData, { FetchType } from '../../../Hooks/useFetchData';

import './Room.scss';
import Message, { MessageType } from '../../Message/Message';

function PasscodeDialog({ isDialogOpen, onClose, onSubmit, message }: any) {
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
    {message ? <Message message={message} /> : null}
  </Dialog>
}

export function Room({ room, user }: any) {
  const [, , errorMessage, next] = useFetchData('http://localhost/api/rooms/join/players', FetchType.PUT, undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  function renderPadlock(passcode: string) {
    return <IconButton edge="start" color="secondary" aria-label="menu" disabled={true}>
      {passcode ? <Lock /> : <LockOpen />}
    </IconButton>
  }

  function joinRoom(passcode?: string) {
    const data: any = { roomId: room._id, clientId: user._id };
    if (passcode?.length) {
      data.passcode = passcode;
    }
    // reroute to room.
    next(data).catch(() => { });
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
      onSubmit={(pc: string) => joinRoom(pc)}
      isDialogOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      message={{ text: errorMessage, type: MessageType.ERROR }}
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
