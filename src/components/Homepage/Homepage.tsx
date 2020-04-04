import React, { useContext } from 'react';
import { Typography, Container, Button } from '@material-ui/core';

import './Homepage.scss';
import { RouterContext } from '../../Contexts/RouteProvider';

const Homepage = React.memo(() => {
  const { history } = useContext(RouterContext);

  function onPlay() {
    if (history) {
      history.push('/rooms');
    }
  }

  return <div>
    <section className="homepage-section title">
      <Container maxWidth="md">
        <div className="title-container">
          <Typography className="title" variant="h2" style={{ width: 200 }}>
            Cards against formality
        </Typography>
          <Typography className="subtitle" variant="h6" style={{ width: 200 }}>
            A terrible Cards against humanity clone.
        </Typography>
          <div className="play-button-container">
            <Button className="play-button" variant="contained" color="primary" onClick={onPlay}>Play</Button>
          </div>
        </div>
      </Container>
    </section>
    <section className="homepage-section even">
      <Container maxWidth="md">
        <Typography className="title" variant="h2" style={{ color: "black" }}>
          About
        </Typography>
        <Typography className="" variant="body1" style={{ color: "black" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </Typography>
      </Container>
    </section>
    <section className="homepage-section">
      <Container maxWidth="md">
      </Container>
    </section>
  </div>;
});

export default Homepage;