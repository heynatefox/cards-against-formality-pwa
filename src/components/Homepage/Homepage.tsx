import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link, Typography, Container, Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';

import Card from '../Card/Card';
import './Homepage.scss';
import { ThemeContext } from '../../Contexts/ThemeProvider';

const Homepage = React.memo(() => {
  const navigate = useNavigate();
  const { name } = useContext(ThemeContext);


  function onPlay() {
    navigate('/rooms');
  }

  function onWindowOpen(target: string) {
    window.open(target);
  }

  function renderCards() {
    const cards = [
      { cardType: 'black', _id: '1', text: `During my first game of D&amp;D, I accidentally summoned _.`, pick: 1 },
      { cardType: 'white', _id: '2', text: `My inner demons.` }
    ];

    if (name === 'dark') {
      return cards.map((card, i) => <Card key={card._id} className={i === 0 ? 'first-card' : 'second-card'} card={card} />);
    }

    return cards.reverse().map((card, i) => <Card key={card._id} className={i === 0 ? 'first-card' : 'second-card'} card={card} />);
  }

  return <div>
    <section className="homepage-section title">
      <Container maxWidth="md">
        <div className="card-group-wrapper">
          <div className="card-group">
            {renderCards()}
          </div>
        </div>
        <div className="title-container">
          <Typography className="title" variant="h2" style={{ width: 200 }}>
            Cards Against Formality
          </Typography>
          <Typography className="subtitle" variant="h6" style={{ width: 200 }}>
            A terrible card game. For terrible people...
          </Typography>
          <div className="play-button-container">
            <Button className="play-button" variant="contained" color="primary" onClick={onPlay}>Play</Button>
          </div>
        </div>
      </Container>

    </section>
    <section className="homepage-section even about">
      <Container maxWidth="md">
        <Typography className="title" variant="h2" style={{ color: "black" }}>
          About
        </Typography>
        <br />
        <Typography variant="body1" style={{ color: "black" }}>
          Click the play button above. Play anonymously, or sign in with your favourite social media account. Then proceed to play with your friends and family. Works great on mobile, desktop or tablet!
        </Typography>
        <br />
        <Typography variant="h5" style={{ color: "black" }}>
          How to play.
        </Typography>
        <Typography variant="body1" style={{ color: "black" }}>
          <ul>
            <li> Each player starts with a hand of 10 white cards.</li>
            <li> A black card is chosen at random and displayed to all players.</li>
            <li> The black card will present a number i.e. <span className="pick-option">2</span> Each player must play this number of white cards.</li>
            <li> The first player starts as the Card Czar. Their role is to select their favourite white card as the winner. The winning player receives 1 point!</li>
          </ul>
        </Typography>
        <br />
        <Typography variant="subtitle1" style={{ color: "black" }}>
          Cards Against Formality is a party card game based on <Link rel="noopener" onClick={() => onWindowOpen('https://cardsagainsthumanity.com/')}>Cards Against Humanity</Link>.
          The two are not affiliated with each other in any way.
        </Typography>
        <br />
        <Typography variant="subtitle1" style={{ color: "black" }}>
          The game is free to play and always will be. The website will never contain any advertisements or bloat.
          This is to keep an uninterrupted user experience, and to stick well within Cards against humanity's licensing guidelines. All card content is produced and owned by <Link rel="noopener" onClick={() => onWindowOpen('https://cardsagainsthumanity.com/')}>Cards Against Humanity</Link>.
        </Typography>
        <br />
        <Typography variant="subtitle1" style={{ color: "black" }}>
          We can not accept any payments or donations of any kind. If you would like to contribute please contact us via <Link onClick={() => onWindowOpen('https://twitter.com/CardsFormality')}>Twitter</Link> to discuss further ways you can help!
        </Typography>
      </Container>
    </section>

    <section className="homepage-section footer">
      <div className="link-icons">
        <TwitterIcon className="icon" fontSize="large" onClick={() => onWindowOpen('https://twitter.com/CardsFormality')} />
        <GitHubIcon className="icon" fontSize="large" onClick={() => onWindowOpen('https://github.com/heynatefox/cards-against-formality')} />
      </div>
      <Typography variant="caption">
        To view the privacy and terms of use, click <Link color="secondary" onClick={() => onWindowOpen('https://htmlpreview.github.io/?https://github.com/heynatefox/cards-against-formality-pwa/blob/master/public/privacy_policy.html')}>here</Link> and <Link color="secondary" onClick={() => onWindowOpen('https://htmlpreview.github.io/?https://github.com/heynatefox/cards-against-formality-pwa/blob/master/public/license.html')}>here</Link>
      </Typography>
    </section>
  </div >;
});

export default Homepage;
