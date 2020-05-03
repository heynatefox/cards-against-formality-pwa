import React from 'react';

import GameCard from '../Card/Card';
import './GenericCardGroup.scss';

export default function GenericGardGroup({ leftCardText, rightCardText, leftCardChild, rightCardChild }:
  { leftCardText: string; rightCardText: string, leftCardChild?: React.ReactNode, rightCardChild?: React.ReactNode }) {

  return <div className="card-group">
    <GameCard className="first-card" card={{ cardType: 'black', _id: '1', text: `${leftCardText} _`, pick: 1 }}>
      {leftCardChild}
    </GameCard>
    <GameCard className="second-card" card={{ cardType: 'white', _id: '2', text: rightCardText }}>
      {rightCardChild}
    </GameCard>
  </div>
}
