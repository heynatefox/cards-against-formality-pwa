import React, { useEffect } from 'react';
import { Container, Backdrop, CircularProgress, Typography } from '@material-ui/core';

import useGameRoom from './useGameRoom';
import './Game.scss';

export default function Game() {
  const [room, isLoading, errorMessage] = useGameRoom();

  useEffect(() => {
    console.log(room);
  }, [room]);


  function renderMain() {
    if (isLoading) {
      return <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    }

    if (!isLoading && errorMessage?.length) {
      return <div>
        <Typography className="title" variant="h2">
          {errorMessage}
        </Typography>
      </div>;
    }

    return <div>
      <pre>{JSON.stringify(room)}</pre>
    </div>
  }

  return <Container className="game-container">
    {renderMain()}
  </Container>
}