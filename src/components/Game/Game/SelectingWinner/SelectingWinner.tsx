import React, { useState, useCallback } from 'react';
import { Button, Typography } from '@material-ui/core';

import GameCard from '../../../Card/Card';
import { TurnDataWithState } from '../Game';
import { Card } from '../Game';

import './SelectingWinner.scss';

function UserSelection({ cards, userId, onSelect, isSelected }: { cards: Card[]; userId: string, onSelect: (userId: string) => void, isSelected: boolean }) {
  return <div
    className={`user-selection ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelect(userId)}
  >
    {cards.map(card => <GameCard key={card._id + 'user-selection'} card={card} className="user-selection-card" />)}
  </div>
}

export interface SelectingWinnerProps {
  game: TurnDataWithState;
  onWinnerSelect: (winnerId: string) => void;
  isCzar: boolean;
  maxChildHeight?: number
}

export default function SelectingWinner({ onWinnerSelect, game, isCzar, maxChildHeight }: SelectingWinnerProps) {

  const [selectedWinner, setSelectedWinner] = useState('');
  const onCardSelected = useCallback((id: string) => {
    if (!isCzar) {
      return;
    }

    setSelectedWinner(prevSelected => prevSelected === id ? '' : id);
  }, [isCzar]);

  function renderSubmit() {
    if (!isCzar) {
      return null;
    }

    return <Button
      disabled={!selectedWinner?.length}
      onClick={() => onWinnerSelect(selectedWinner)}
      variant="contained"
      color="primary"
      className="user-submit"
    >
      Submit
    </Button>;
  }

  return <>
    <div className="submit-wrapper">
      <Typography className="submit-text">
        {isCzar ? 'Select your favourite answer!' : 'Wait while the Czar picks their favourite!'}
      </Typography>
      {renderSubmit()}
    </div>
    <div className="user-selection-container" style={{ maxHeight: maxChildHeight }}>
      {Object.entries(game.selectedCards).map(([userId, cards]) => {
        return <UserSelection
          key={userId}
          cards={cards}
          userId={userId}
          onSelect={onCardSelected}
          isSelected={isCzar && selectedWinner === userId}
        />
      })}
    </div>
  </ >;
}
