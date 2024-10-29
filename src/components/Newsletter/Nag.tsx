import React, { useContext, useEffect, useId, useState } from 'react';

import { newsletterLink } from './Campaigns';

import './Nag.scss';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { UserContext } from '../../Contexts/UserProvider';
import { UTM, variants } from './Campaigns';

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


export const Nag = ({
  id,
  utm,
  onClick,
  onDismiss,
}: {
  id: string,
  utm: UTM,
  onClick: () => void,
  onDismiss: () => void,
}) => {
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState(false);

  const campaignVariants = variants[utm.campaign];
  const [variant, _] = useState(Math.floor(Math.random() * campaignVariants.length));

  useEffect(() => {
    requestAnimationFrame(() => {
      setVisible(true);
    })
  }, [])

  const link = newsletterLink(utm, user);

  return (<div className={`suggestion-overlay${visible ? " entered" : ""}`}>
    <a
      id={id}
      target="_blank"
      rel="noopener"
      href={link}
      onClick={onClick}
    >
      {campaignVariants[variant]}
    </a>
    <div className="dismiss">
      <IconButton
        onClick={onDismiss}
        color="inherit"
        title="Not now, thanks."
      >
        <Close />
      </IconButton>
    </div>
  </div >)
};

export const NagOpportunity = ({
  children,
  initialActivation,
  utm,
}: {
  children: any,
  initialActivation?: boolean,
  utm: UTM,
}) => {
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
      {nagContext.recency.activeNag === id ? (<Nag
        id={id}
        utm={utm}
        onClick={() => nagContext.setRecency({ activeNag: null, previouslyEngaged: true, lastNagged: new Date() })}
        onDismiss={() => dismiss(id, nagContext)}
      />) : null}
    </div>
  )
};
