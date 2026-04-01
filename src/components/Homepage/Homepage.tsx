import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link, Typography, Button } from '@material-ui/core';
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

  return (
    <div className="homepage-root">
      {/* Hero */}
      <section className="homepage-hero">
        <div className="hero-card-decoration">
          <div className="card-group">
            {renderCards()}
          </div>
        </div>
        <div className="hero-content">
          <Typography className="hero-title" variant="h2">
            Cards<br />Against<br /><span>Formality</span>
          </Typography>
          <Typography className="hero-subtitle" variant="h6">
            A terrible card game. For terrible people.
          </Typography>
          <Button className="hero-play-btn" variant="contained" color="primary" onClick={onPlay}>
            Play Now
          </Button>
        </div>
      </section>

      {/* About */}
      <section className="homepage-about">
        <Typography className="about-title" variant="h2">
          About
        </Typography>
        <Typography className="about-body" variant="body1">
          Click play, join anonymously or sign in. Play with friends and family — works great on mobile, desktop, or tablet.
        </Typography>
        <br />
        <Typography variant="h5">How to play.</Typography>
        <Typography className="about-body" variant="body1">
          <ul>
            <li>Each player starts with a hand of 10 white cards.</li>
            <li>A black card is chosen at random and displayed to all players.</li>
            <li>The black card shows a pick number <span className="pick-option">2</span> — each player plays that many white cards.</li>
            <li>The Card Czar picks their favourite. Winner gets a point!</li>
          </ul>
        </Typography>
        <br />
        <Typography variant="subtitle1">
          Cards Against Formality is based on{' '}
          <Link rel="noopener" onClick={() => onWindowOpen('https://cardsagainsthumanity.com/')}>Cards Against Humanity</Link>.
          The two are not affiliated.
        </Typography>
        <br />
        <Typography variant="subtitle1">
          Free to play. No ads. No bloat. All card content produced and owned by{' '}
          <Link rel="noopener" onClick={() => onWindowOpen('https://cardsagainsthumanity.com/')}>Cards Against Humanity</Link>.
        </Typography>
        <br />
        <Typography variant="subtitle1">
          Questions? Reach us on{' '}
          <Link onClick={() => onWindowOpen('https://twitter.com/CardsFormality')}>Twitter</Link>.
        </Typography>
      </section>

      {/* Footer */}
      <section className="homepage-footer">
        <div className="footer-icons">
          <TwitterIcon className="icon" fontSize="large" onClick={() => onWindowOpen('https://twitter.com/CardsFormality')} />
          <GitHubIcon className="icon" fontSize="large" onClick={() => onWindowOpen('https://github.com/heynatefox/cards-against-formality')} />
        </div>
        <Typography variant="caption">
          View our{' '}
          <Link color="secondary" onClick={() => onWindowOpen('https://htmlpreview.github.io/?https://github.com/heynatefox/cards-against-formality-pwa/blob/master/public/privacy_policy.html')}>privacy policy</Link>
          {' '}and{' '}
          <Link color="secondary" onClick={() => onWindowOpen('https://htmlpreview.github.io/?https://github.com/heynatefox/cards-against-formality-pwa/blob/master/public/license.html')}>terms of use</Link>.
        </Typography>
      </section>
    </div>
  );
});

export default Homepage;
