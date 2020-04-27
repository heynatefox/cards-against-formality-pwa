import React, { useState, useCallback } from 'react';
import { Button, Typography } from '@material-ui/core';

import GameCard from '../../Card/Card';
import './CardSelector.scss';
import { GameState } from '../Game/Game';

export interface CardSelectorProps {
  state: GameState;
  cards: any[];
  onCardsSubmit: (cards: string[]) => Promise<any>;
  isCzar: boolean;
  pick: number;
}

// expansion pannel of cards. Default open. Allow selection and submition. Disable if you're the czar.
export default React.memo(({ state, cards, onCardsSubmit, isCzar, pick }: CardSelectorProps) => {

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

    if (!isCzar) {
      return <Button
        disabled={!selectedCards.length || state !== GameState.PICKING_CARDS || selectedCards.length !== pick}
        variant="contained"
        color="primary"
        onClick={onSubmit}
      >
        Submit
         </Button>
    }

    return <Typography>The Czar is not allowed to select cards to play</Typography>;
  }

  return <div className="cards-list">
    <div className="cards-action">
      {renderAction()}
    </div>
    <div className="cards-list-container">
      {cards.map(card => <GameCard
        className="card-selector-card"
        key={card._id + 'cards-display'}
        card={card}
        onSelect={onSelect}
        isSelected={selectedCards.includes(card._id)}
        isUnselectable={isCzar || hasSubmitted || state !== GameState.PICKING_CARDS}
      />)}
    </div>
  </div>
});
