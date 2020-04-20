import React, { useContext } from 'react';
import { Link, Typography, Container, Button } from '@material-ui/core';

import './Homepage.scss';
import { RouterContext } from '../../Contexts/RouteProvider';

const Homepage = React.memo(() => {
  const { history } = useContext(RouterContext);

  function onPlay() {
    if (history) {
      history.push('/rooms');
    }
  }

  function onWindowOpen(target: string) {
    window.open(target);
  }

  return <div>
    <section className="homepage-section title">
      <Container maxWidth="md">
        <div className="title-container">
          <Typography className="title" variant="h2" style={{ width: 200 }}>
            Cards Against Formality
        </Typography>
          <Typography className="subtitle" variant="h6" style={{ width: 200 }}>
            A terrible Card game. For terrible people...
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
        <Typography variant="body1" style={{ color: "black" }}>
          Cards Against Formality is a party card game based on <Link rel="noopener" onClick={() => onWindowOpen('https://cardsagainsthumanity.com/')}>Cards Against Humanity</Link>.
          The game is still under development, and not currently fully functional.
          Expect many bugs, and lack of features!
        </Typography>
        <br />
        <Typography variant="body1" style={{ color: "black" }}>
          The project is opensource. To find out more, visit the <Link onClick={() => onWindowOpen('https://github.com/jordanpawlett/cards-against-formality')} rel="noopener">github</Link>.
        </Typography>
      </Container>
    </section>
    <section className="homepage-section footer">
      <Typography variant="caption">
        To view the privacy and terms of use, click <Link onClick={() => onWindowOpen('https://htmlpreview.github.io/?https://github.com/JordanPawlett/cards-against-formality-pwa/blob/master/public/privacy_policy.html')}>here</Link> and <Link onClick={() => onWindowOpen('https://htmlpreview.github.io/?https://github.com/JordanPawlett/cards-against-formality-pwa/blob/master/public/license.html')}>here</Link>
      </Typography>
    </section>
  </div>;
});

export default Homepage;