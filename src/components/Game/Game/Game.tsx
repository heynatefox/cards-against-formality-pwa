import React, { useState, useEffect, useCallback } from 'react';

import './Game.scss';
import { Typography, CircularProgress, Button } from '@material-ui/core';

export interface Card {
  _id: string;
  text: string;
  cardType: 'white' | 'black';
  pick?: number;
}

export enum GameState {
  TURN_SETUP = 'turnSetup',
  PICKING_CARDS = 'pickingCards',
  SELECTING_WINNER = 'selectingWinner',
  ENEDED = 'ended'
}

export interface GamePlayer {
  _id: string;
  score: number;
  isCzar: boolean;
  cards?: string[];
}

export interface TurnData {
  czar: string;
  blackCard: Card;
  turn: number;
  totalTime: number;
}

export interface TurnDataWithState extends TurnData {
  state: GameState;
  players: GamePlayer[];
  roomId: string;
  selectedCards: { [id: string]: Card[] };
  winner: string;
  winningCards: Card[];
}

export interface GameProps {
  game: TurnDataWithState;
  players: any[];
  cards: Card[];
  isCzar: boolean;
  onCardsSubmit: (cards: string[]) => Promise<any>;
  onWinnerSelect: (winnerId: string) => void;
}


// if turn is 0. This is the initial setup. Else, display winner + winning cards.
function TurnSetup({ game, players }: { game: TurnDataWithState, players: any[] }) {

  if (game.turn === 0) {
    return <div>
      <Typography>Sacrificing a chicken for your enjoyment</Typography>
      <CircularProgress />
    </div>
  }

  if (!game.winner) {
    return <div>
      <Typography>
        No one selected any cards. Everyone loses!
      </Typography>
    </div>;
  }

  return <div>
    <pre>{players.find(player => player._id === game.winner)?.username} wins!</pre>
    <Card card={game.blackCard} />
    {game.winningCards.map(card => <Card key={card._id + 'user-selection'} card={card} />)}
  </div>;
}

function UserSelection({ cards, userId, onSelect, isSelected }: { cards: Card[]; userId: string, onSelect: (userId: string) => void, isSelected: boolean }) {
  return <div className={`user-selection ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(userId)}>
    {cards.map(card => <Card key={card._id + 'user-selection'} card={card} />)}
  </div>
}

// Show all the cards on the screen. Host should select their favourite card(s).
function SelectingWinner({ onWinnerSelect, game, isCzar }: { game: TurnDataWithState; onWinnerSelect: (winnerId: string) => void; isCzar: boolean }) {
  const [selectedWinner, setSelectedWinner] = useState('');
  return <div>
    {isCzar ? <Button disabled={!selectedWinner?.length} onClick={() => onWinnerSelect(selectedWinner)}>Submit</Button> : null}
    <Card card={game.blackCard} />
    <div style={{ display: 'flex' }}>
      {Object.entries(game.selectedCards).map(([userId, cards]) => {
        return <UserSelection key={userId} cards={cards} userId={userId} onSelect={(setSelectedWinner as any)} isSelected={selectedWinner === userId} />
      })}
    </div>
    <Typography>
      {isCzar ? 'Select your favourite answer!' : 'Wait while the czar picks his favourite!'}
    </Typography>
  </div >;
}


// Show black card, maybe some instructions. And blank placed cards.
function PickingCards({ game, isCzar }: { game: TurnDataWithState; isCzar: boolean }) {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, [game])

  return <div>
    {timer >= 0 ? <div>{timer}</div> : null}
    <Card card={game.blackCard} />
    <Typography>
      {!isCzar ? `Pick ${game.blackCard.pick} card(s) then click submit.` : 'You are the Czar. Wait for all player to select their answers'}
    </Typography>
  </div>
}

// game ended. Display overall winner + add more functionality in the future.
function GameEnded({ game }: { game: any }) {
  return <div>
    The winner(s) is!
    {game.players.map((player: any) => <div key={player}>{player}</div>)}
  </div>
}


function Card({ card, onSelect, isSelected, isUnselectable }: { card: Card; onSelect?: (_id: string) => void; isSelected?: boolean; isUnselectable?: boolean }) {
  const onClick = useCallback(_onClick, [card, onSelect]);
  function _onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!onSelect) {
      return;
    }
    onSelect(card._id);
  }
  return <div draggable={true} className={`playing-card ${card.cardType} ${isSelected ? 'selected' : ''} ${isUnselectable ? 'unselectable' : ''}`} onClick={onClick}>
    {card.text}
  </div>;
}

// expansion pannel of cards. Default open. Allow selection and submition. Disable if you're the czar.
function Cards({ cards, onCardsSubmit, isCzar }: { cards: Card[], onCardsSubmit: (cards: string[]) => Promise<any>, isCzar: boolean }) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const onSelect = useCallback(_onSelect, [selectedCards]);

  function _onSelect(_id: string) {
    const index = selectedCards.indexOf(_id);
    if (index >= 0) {
      selectedCards.splice(index, 1);
    } else {
      selectedCards.push(_id);
    }
    setSelectedCards(selectedCards.slice(0));
  }

  function onSubmit() {
    onCardsSubmit(selectedCards)
      .then(() => {
        setSelectedCards([]);
        setHasSubmitted(true);
      })
      .catch((err) => {
        // display toasty message
      })
  }

  if (!cards?.length) {
    return null;
  }

  function renderAction() {
    if (hasSubmitted) {
      return null;
    }

    return !isCzar ? <Button onClick={onSubmit}>Submit</Button> : <Typography>You're unable to play a card as the Czar</Typography>;
  }

  return <div className="cards-list">
    {renderAction()}
    <div className="cards-list-container">
      {cards.map(card => <Card
        key={card._id + 'cards-display'}
        card={card}
        onSelect={onSelect}
        isSelected={selectedCards.includes(card._id)}
        isUnselectable={isCzar || hasSubmitted}
      />)}
    </div>
  </div>
}

export default function Game({ game, players, cards, isCzar, onCardsSubmit, onWinnerSelect }: GameProps) {
  const [gameState, setGameState] = useState<string | null>(null);
  useEffect(() => {
    if (game?.state) {
      setGameState(game.state);
    }
  }, [game]);

  function renderBasedOnGameState() {
    switch (gameState) {
      case GameState.TURN_SETUP:
        return <TurnSetup game={game} players={players} />;
      case GameState.PICKING_CARDS:
        return <PickingCards game={game} isCzar={isCzar} />;
      case GameState.SELECTING_WINNER:
        return <SelectingWinner game={game} onWinnerSelect={onWinnerSelect} isCzar={isCzar} />;
      case GameState.ENEDED:
        return <GameEnded game={game} />;
      default:
        return <Typography>You have recently joined. You must wait until the next turn to play.</Typography>
    }
  }
  return <div className="game-container">
    {game ? <Typography>Turn {game.turn}</Typography> : null}
    <div className="game-content">
      {renderBasedOnGameState()}
    </div>
    <div className="spacer" />
    <div className="card-selector-container">
      <Cards cards={cards} onCardsSubmit={onCardsSubmit} isCzar={isCzar} />
    </div>
  </div >
}