import React, { useContext, useEffect, useId, useState } from 'react';

import { newsletterLink } from '../../config';

import './Nag.scss';
import { IconButton, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';

// Five minutes.
const maximumNagFrequencyMillis = 5 * 60 * 1000;

export interface NagRecency {
  // If the user has engaged with the nag previously.
  previouslyEngaged: boolean;
  // If a nag is actively visible at the moment, the id of that nag.
  activeNag: string | null;
  // The last time a nag was visible.
  lastNagged: Date | null;
}

export const initialNagRecency: NagRecency = {
  previouslyEngaged: false,
  activeNag: null,
  lastNagged: null,
};

export interface NewsletterNagContextProps {
  recency: NagRecency;
  setRecency: (receny: NagRecency) => void;
}

export const NewsletterNagContext = React.createContext<NewsletterNagContextProps>({
  recency: initialNagRecency,
  setRecency: () => {
    // If we don't have context, we can't do much.
  },
});

const trigger = (id: string, { recency, setRecency }: NewsletterNagContextProps) => {
  if (!recency.previouslyEngaged && !naggedRecently(recency)) {
    setRecency({ ...recency, activeNag: id });
  }
};

const dismiss = (id: string, { recency, setRecency }: NewsletterNagContextProps) => {
  if (recency.activeNag === id) {
    setRecency({ ...recency, activeNag: null, lastNagged: new Date() });
  }
};

const naggedRecently = ({ activeNag, lastNagged }: NagRecency) =>
  activeNag ?
    true :
    lastNagged ?
      (new Date().getMilliseconds() - lastNagged.getMilliseconds()) < maximumNagFrequencyMillis :
      false;

const variants = [
  (<>
    <Typography variant="subtitle1">Interested in other fun stuff?</Typography>
    <Typography variant="subtitle2"><span className="call-to-action">Join our newsletter</span> for a chance to win $100!</Typography>
  </>),
  (<>
    <Typography variant="subtitle2">Celebrate 4 years of CAF and enter to win $100! <span className="call-to-action">Click here</span>.</Typography>
  </>),
  (<>
    <Typography variant="subtitle2">Help us build a community pack and enter to win $100 by <span className="call-to-action">joining our newsletter</span>.</Typography>
  </>),
  (<>
    <Typography variant="subtitle1">Like free shit?</Typography>
    <Typography variant="subtitle2"><span className="call-to-action">Join our newsletter</span> and enter to win $100.</Typography>
  </>),
  (<>
    <Typography variant="subtitle1"><span className="call-to-action">Click here</span> if you like free shit.</Typography>
  </>),
] as const;

const Nag = ({ id }: { id: string }) => {
  const context = useContext(NewsletterNagContext);
  const [visible, setVisible] = useState(false);
  const [variant, _] = useState(Math.floor(Math.random() * variants.length));

  useEffect(() => {
    requestAnimationFrame(() => {
      setVisible(true);
    })
  }, [])

  return (<div className={`suggestion-overlay${visible ? " entered" : ""}`}>
    <a
      id={id}
      target="_blank"
      rel="noopener"
      href={newsletterLink}
      onClick={() => context.setRecency({ activeNag: null, previouslyEngaged: true, lastNagged: new Date() })}
    >
      {variants[variant]}
    </a>
    <div className="dismiss">
      <IconButton
        onClick={() => dismiss(id, context)}
        color="inherit"
        title="Not now, thanks."
      >
        <Close />
      </IconButton>
    </div>
  </div>)
};

export const NagOpportunity = ({ children, initialActivation }: { children: any, initialActivation?: boolean }) => {
  const nagContext = useContext(NewsletterNagContext);
  const id = useId();

  useEffect(() => {
    if (initialActivation) {
      trigger(id, nagContext);
    }
  }, [initialActivation]);

  return (
    <div className="suggestion-anchor" onClick={() => trigger(id, nagContext)}>
      {children}
      {nagContext.recency.activeNag === id ? (<Nag id={id} />) : null}
    </div>
  )
};
