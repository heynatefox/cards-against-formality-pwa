import React, { useState } from 'react';
import { CircularProgress, FormControl, InputLabel, Input, FormHelperText, Switch, FormControlLabel, Slide, Card, CardContent, CardHeader, CardActions, Button } from '@material-ui/core';

import './CreateRoom.scss';
import useFetchData, { FetchType } from '../../../Hooks/useFetchData';

export default function CreateRoom() {
  const [isProtected, setIsProtected] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState(10);
  const [, isLoading, , next] = useFetchData('http://localhost/api/rooms', FetchType.POST, undefined);

  function handleSubmit() {
    const room = {
      name,
      options: {
        target,
        // maxPlayers
        decks: []
      },
    }
    if (isProtected && passcode.length) {
      (room as any).passcode = passcode;
    }
    next(room);
  }

  function renderPasswordForm() {
    return <Slide direction="right" in={isProtected}>
      <div>
        <InputLabel htmlFor="passcode">Password</InputLabel>
        <Input id="passcode" aria-describedby="password-helper" required={false} value={passcode} onChange={e => setPasscode(e.target.value)} />
        <FormHelperText id="password-helper">People will need this password to enter your game.</FormHelperText>
      </div>
    </Slide>;
  }

  return <Card className="form-container" variant="elevation">
    <CardHeader title="Create Game" subheader="Invite your friends!" />
    <CardContent>
      <form className="create-room-form">
        <FormControl>
          <InputLabel htmlFor="name">Game Name</InputLabel>
          <Input id="name" aria-describedby="game-name-helper" required={true} value={name} onChange={e => setName(e.target.value)} />
          <FormHelperText id="game-name-helper">This is how people will find your game.</FormHelperText>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="target">Target Score</InputLabel>
          <Input id="target" type="number" aria-describedby="score-helper" required={true} value={target} onChange={e => setTarget(parseInt(e.target.value, 10))} />
          <FormHelperText id="score-helper">Number of points required to end the game.</FormHelperText>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={isProtected} onChange={e => setIsProtected(e.target.checked)} name="checkedA" />}
          label="Password"
        />
        {renderPasswordForm()}
      </form>
      <CardActions>
        {!isLoading ? <Button variant="contained" color="primary" size="small" onClick={handleSubmit}>Create</Button> : <CircularProgress />}
      </CardActions>
    </CardContent>
  </Card>
}