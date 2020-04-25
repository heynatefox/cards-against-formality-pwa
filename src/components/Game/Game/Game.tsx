import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';

import Card from '../../Card/Card';
import TurnSetup from './TurnSetup/TurnSetup';
import PickingCards from './PickingCards/PickingCards';
import SelectingWinner from './SelectingWinner/SelectingWinner';
import GameEnded from './GameEnded/GameEnded';

import './Game.scss';

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
  isCzar: boolean;
  onWinnerSelect: (winnerId: string) => void;
}

export default function Game({ game, players, isCzar, onWinnerSelect }: GameProps) {
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
        return <PickingCards game={game} />;
      case GameState.SELECTING_WINNER:
        return <SelectingWinner game={game} onWinnerSelect={onWinnerSelect} isCzar={isCzar} />;
      case GameState.ENEDED:
        return <GameEnded game={game} players={players} />;
      default:
        return <div className="card-group">
          <Card className="first-card" card={{ cardType: 'black', _id: '1', text: `You have recently joined`, pick: 1 }}>
            <CircularProgress color="inherit" />
          </Card>
          <Card className="second-card" card={{ cardType: 'white', _id: '2', text: `You will join when the next round starts` }} />
        </div>
    }
  }
  return <div className="game-container game-content">
    {renderBasedOnGameState()}
  </div >
}