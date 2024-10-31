import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  CircularProgress, FormControl, InputLabel, Input, FormHelperText, Switch,
  FormControlLabel, Card, CardContent, CardActions, Button, FormLabel, FormGroup, Checkbox,
  Accordion, AccordionSummary, Typography, AccordionDetails, Divider, Select, MenuItem
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './CreateRoom.scss';
import useFetchData, { FetchType } from '../../../Hooks/useFetchData';
import { SnackbarContext } from '../../../Contexts/SnackbarProvider';
import { NagOpportunity } from '../../Newsletter/Nag';

function DeckSelector({ decks, onChange }: { decks: any[], onChange: (decks: string[]) => void }) {
  const [deckOptions, setDeckOptions] = useState<{ name: string; _id: string, value?: boolean }[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const toggleSelectAll = useCallback(() => {
    setDeckOptions(prevDeck => {
      prevDeck.forEach(deck => deck.value = !isAllSelected);
      return [...prevDeck];
    });

    setIsAllSelected(!isAllSelected);
  }, [isAllSelected])

  useEffect(() => {
    if (decks) {
      setDeckOptions(decks.map(deck => {
        return { value: deck.name.includes('Base'), ...deck }
      }));
    }
  }, [decks]);

  useEffect(() => {
    onChange(deckOptions.filter(deck => deck.value).map(deck => deck._id));
  }, [deckOptions, onChange]);


  function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  return <Accordion expanded={isExpanded} onChange={() => { setIsExpanded(prev => !prev) }}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography>Available Decks!</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <FormControl required component="fieldset" error={!deckOptions.some(deck => deck.value)}>
        <FormControlLabel
          control={<Checkbox checked={isAllSelected} onChange={toggleSelectAll} name="Select all" />}
          label="Select all"
        />
        <Divider />
        <FormLabel component="legend">Select which decks you would like to play with</FormLabel>
        <FormGroup className="deck-checkbox-group">
          {deckOptions.map(deck => {
            return <NagOpportunity key={deck._id} medium="deck-selection">
              <FormControlLabel
                control={<Checkbox checked={deck.value} onChange={_onChange} name={deck._id} />}
                label={deck.name}
              />
            </NagOpportunity>
          })}
        </FormGroup>
        <FormHelperText>You must select at least one</FormHelperText>
      </FormControl>
    </AccordionDetails>
  </Accordion>
}

export default function CreateRoom({ onJoin, decksData, user }: any) {
  const { openSnack } = useContext(SnackbarContext);
  const [isProtected, setIsProtected] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [roundTime, setRoundTime] = useState(60);
  const [target, setTarget] = useState(10);
  const limitedSetTarget = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTarget(rangeLimit(event, { min: 5, max: 100 }));
  }, []);
  const [maxPlayers, setMaxPlayers] = useState(10);
  const limitedSetMaxPlayers = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setMaxPlayers(rangeLimit(event, { min: 2, max: 50 }));
  }, []);
  const [, isLoading, , createRoom] = useFetchData(`/api/rooms`, FetchType.POST);
  const [decks, setDecks] = useState([]);
  const [errorField, setErrorField] = useState<string | null>(null);

  function rangeLimit(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    { min, max }: { min: number; max: number } = { min: 4, max: 10 }
  ): number {
    const value = parseInt(event.target.value, 10);

    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
  }

  function handleSubmit() {
    const room = {
      name: name?.length ? name : user?.username,
      options: {
        target,
        maxPlayers,
        maxSpectators: 10,
        decks,
        roundTime
      },
    }
    if (isProtected && passcode.length) {
      (room as any).passcode = passcode;
    }
    createRoom(room)
      .then((axiosRes) => {
        onJoin(axiosRes.data._id, passcode);
        (window as any)?.gtag('event', 'create_room', { value: passcode?.length ? 'private' : 'public' });
      })
      .catch((err) => {
        if (err?.response?.data.type === 'VALIDATION_ERROR') {
          const errObj = err?.response?.data.data[0];
          setErrorField(errObj.field as string);
        }
        openSnack({ text: 'Something went wrong...', severity: 'error' });
      });
  }

  function onKeyPress(e: any) {
    if (e.charCode === 13) {
      handleSubmit();
    }
  }

  function renderPasswordForm() {
    if (!isProtected) {
      return null;
    }

    return <FormControl error={errorField === 'passcode'}>
      <InputLabel htmlFor="passcode">Password</InputLabel>
      <Input id="passcode" aria-describedby="password-helper" required={false} value={passcode} onChange={e => setPasscode(e.target.value)} />
      <FormHelperText id="password-helper">
        {errorField !== 'passcode' ? 'People will need this password to enter your game.' : 'Password must be between 4-12 characters long with no special characters.'}
      </FormHelperText>
    </FormControl>;
  }

  function renderCardContent() {
    return <CardContent className="create-form-card-content">
      <form className="create-room-form" onKeyPress={onKeyPress}>
        <FormControl required={true} error={errorField === 'name'}>
          <Input id="name" aria-describedby="game-name-helper" value={name} onChange={e => { setName(e.target.value); }} placeholder={user?.username} />
          <FormHelperText id="score-helper">{errorField === 'name' ? "Game name must be between 2-16 characters long with no special characters!" : "Game name"}</FormHelperText>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="target">Target Score</InputLabel>
          <Input id="target" type="number" aria-describedby="score-helper" value={target} onChange={limitedSetTarget} />
          <FormHelperText id="score-helper">Number of points required to end the game.</FormHelperText>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="max-players">Max Players</InputLabel>
          <Input id="max-players" type="number" aria-describedby="max-players-helper" value={maxPlayers} onChange={limitedSetMaxPlayers} />
        </FormControl>
        <FormControl>
          <InputLabel id="roundTime-label">Round time (seconds)</InputLabel>
          <Select
            labelId="roundTime-label"
            id="roundTime"
            value={roundTime}
            onChange={(e: any) => setRoundTime(parseInt(e.target.value, 10))}
          >
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={45}>45</MenuItem>
            <MenuItem value={60}>60</MenuItem>
          </Select>
          <FormHelperText>How you have to select your answers</FormHelperText>
        </FormControl>
        {!decksData?.rows ? null : <DeckSelector decks={decksData.rows} onChange={setDecks as any} />}
        <FormControlLabel
          control={<Switch checked={isProtected} onChange={e => setIsProtected(e.target.checked)} name="checkedA" />}
          label="Private"
        />
        {renderPasswordForm()}
      </form>
    </CardContent>
  }

  const Submit = <CardActions>
    {!isLoading ? <Button variant="contained" color="primary" size="small" onClick={handleSubmit}>Create</Button> : <CircularProgress />}
  </CardActions>;
  return <Card className="form-container" variant="elevation">
    {Submit}
    {renderCardContent()}
    {Submit}
  </Card>
}