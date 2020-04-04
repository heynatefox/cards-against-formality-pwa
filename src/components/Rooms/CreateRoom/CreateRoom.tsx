import React, { useState, useEffect } from 'react';
import { CircularProgress, FormControl, InputLabel, Input, FormHelperText, Switch, FormControlLabel, Slide, Card, CardContent, CardHeader, CardActions, Button, FormLabel, FormGroup, Checkbox } from '@material-ui/core';

import './CreateRoom.scss';
import useFetchData, { FetchType } from '../../../Hooks/useFetchData';
import Message, { MessageType } from '../../Message/Message';

function DeckSelector({ decks }: { decks: any[] }) {
  const [deckOptions, setDeckOptions] = useState<{ name: string; _id: string, value?: boolean }[]>([]);

  useEffect(() => {
    if (decks) {
      setDeckOptions(decks.map(deck => {
        return { value: deck.name.includes('Base'), ...deck }
      }));
    }
  }, [decks]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDeckOptions(prevDeck => {
      const deck = prevDeck.find(deck => deck._id === e.target.name);
      if (deck) {
        deck.value = e.target.checked;
      }
      return [...prevDeck];
    });
  }

  if (!decks?.length) {
    return null;
  }

  return <FormControl required component="fieldset" error={!deckOptions.some(deck => deck.value)}>
    <FormLabel component="legend">Select which decks you would like to play with</FormLabel>
    <FormGroup>
      {deckOptions.map(deck => {
        return <FormControlLabel
          key={deck._id}
          control={<Checkbox checked={deck.value} onChange={onChange} name={deck._id} />}
          label={deck.name}
        />
      })}
    </FormGroup>
    <FormHelperText>You must select at least one</FormHelperText>
  </FormControl>
}

export default function CreateRoom() {
  const [isProtected, setIsProtected] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState(10);
  const [, isLoading, errorMessage, createRoom] = useFetchData('http://localhost/api/rooms', FetchType.POST);
  const [decksData] = useFetchData<{ rows: any[] } | null>('http://localhost/api/decks?fields=name,_id&pageSize=100', FetchType.GET);

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
    createRoom(room).catch(() => { });
    // route to the room.
  }

  function renderPasswordForm() {
    return <Slide direction="right" in={isProtected}>
      <FormControl>
        <InputLabel htmlFor="passcode">Password</InputLabel>
        <Input id="passcode" aria-describedby="password-helper" required={false} value={passcode} onChange={e => setPasscode(e.target.value)} />
        <FormHelperText id="password-helper">People will need this password to enter your game.</FormHelperText>
      </FormControl>
    </Slide>;
  }

  return <Card className="form-container" variant="elevation">
    <CardHeader title="Create Game" subheader="Invite your friends!" />
    <CardContent>
      <form className="create-room-form">
        <FormControl required={true}>
          <InputLabel htmlFor="name">Game Name</InputLabel>
          <Input id="name" aria-describedby="game-name-helper" value={name} onChange={e => setName(e.target.value)} />
          <FormHelperText id="game-name-helper">This is how people will find your game.</FormHelperText>
        </FormControl>
        <FormControl required={true}>
          <InputLabel htmlFor="target">Target Score</InputLabel>
          <Input id="target" type="number" aria-describedby="score-helper" value={target} onChange={e => setTarget(parseInt(e.target.value, 10))} />
          <FormHelperText id="score-helper">Number of points required to end the game.</FormHelperText>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={isProtected} onChange={e => setIsProtected(e.target.checked)} name="checkedA" />}
          label="Password"
        />
        {renderPasswordForm()}
        {!decksData?.rows ? null : <DeckSelector decks={decksData.rows} />}
        {errorMessage ? <Message message={{ text: errorMessage, type: MessageType.ERROR }} /> : null}
      </form>
      <CardActions>
        {!isLoading ? <Button variant="contained" color="primary" size="small" onClick={handleSubmit}>Create</Button> : <CircularProgress />}
      </CardActions>
    </CardContent>
  </Card>
}