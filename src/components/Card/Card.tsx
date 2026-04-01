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

const parser = new DOMParser();
export default React.memo(({ card, onSelect, isSelected, isUnselectable, className, children }: CardProps) => {
  const onClick = useCallback(_onClick, [card, onSelect, isUnselectable]);
  const words = useMemo(() =>
    card.text.replace(/<br>/g, ' <br> ').split(/[ ]+/)
    , [card]);

  const textStyle = useMemo(() => {
    const len = card.text.length;
    if (len <= 15) return { fontSize: '2.4em', lineHeight: 1.2 };
    if (len <= 30) return { fontSize: '2.0em', lineHeight: 1.25 };
    if (len <= 55) return { fontSize: '1.6em', lineHeight: 1.3 };
    if (len <= 90) return { fontSize: '1.25em', lineHeight: 1.35 };
    if (len <= 140) return { fontSize: '1.0em', lineHeight: 1.4 };
    return { fontSize: '0.8em', lineHeight: 1.4 };
  }, [card.text]);

  const calculatedClassName = useMemo(() => {
    return `no-select playing-card ${card.cardType} ${isSelected ? 'selected' : ''} ${isUnselectable ? 'unselectable' : ''} ${className ? className : ''}`;
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
    className={calculatedClassName}
    onClick={onClick}
  >
    <div className="aspect-ratio-wrapper">
      <div className="card-content">
        <div className="text" style={textStyle}>
          {words.map((word, index) => {
            if (word.includes('<br>')) {
              return <br />;
            }
            if (word.includes('_')) {
              return <span key={index} className="blank-space" />
            }
            const str = parser.parseFromString(word, 'text/html').body.textContent;
            return <span key={index} className="word"> {str}</span>;
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

