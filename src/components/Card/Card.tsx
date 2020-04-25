import React, { useCallback, useMemo } from 'react';
import './Card.scss';

export interface CardProps {
  card: { _id: string; cardType: string, text: string, pick?: number };
  onSelect?: (_id: string) => void;
  isSelected?: boolean;
  isUnselectable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default React.memo(({ card, onSelect, isSelected, isUnselectable, className, children }: CardProps) => {
  const onClick = useCallback(_onClick, [card, onSelect, isUnselectable]);
  const words = useMemo(() => card.text.split(' '), [card]);
  const calculatedClassName = useMemo(() => {
    return `playing-card ${card.cardType} ${isSelected ? 'selected' : ''} ${isUnselectable ? 'unselectable' : ''} ${className ? className : ''}`;
  }, [card, isSelected, isUnselectable, className]);
  function _onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!onSelect || isUnselectable) {
      return;
    }
    onSelect(card._id);
  }

  if (!card) {
    return null;
  }

  return <div
    draggable={true}
    className={calculatedClassName}
    onClick={onClick}
  >
    <div className="aspect-ratio-wrapper">
      <div className="card-content">
        <div className="text">
          {words.map((word, index) => {
            if (word.includes('&reg;')) {
              return <span key={index} className="word">®</span>
            }
            if (word.includes('_')) {
              return <span key={index} className="blank-space" />
            }
            return <span key={index} className="word"> {word}</span>;
          })}
        </div>
        <div className="spacer" />
        {children}
        <div className="spacer" />
        <div className="options">
          <span className="title-plugin">Cards Against Formality</span>
          <div className="spacer" />
          {card.pick ? <> <span>PICK</span><span className="pick-option">{card.pick}</span></> : null}

        </div>
      </div>
    </div>
  </div>;
});

