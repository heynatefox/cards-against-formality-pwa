import React, { useContext, useEffect, useId, useState } from "react";

import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { UserContext } from "../../Contexts/UserProvider";
import {
  NagRecency,
  NewsletterContext,
  NewsletterContextProps,
} from "./Context";
import { newsletterLink, variants } from "./Campaigns";

import "./Nag.scss";

// Five minutes.
const maximumNagFrequencyMillis = 5 * 60 * 1000;

const trigger = (
  id: string,
  { recency, setRecency }: NewsletterContextProps,
) => {
  if (!recency.previouslyEngaged && !naggedRecently(recency)) {
    setRecency({ ...recency, activeNag: id });
  }
};

const dismiss = (
  id: string,
  { recency, setRecency }: NewsletterContextProps,
) => {
  if (recency.activeNag === id) {
    setRecency({ ...recency, activeNag: null, lastNagged: new Date() });
  }
};

export const hasEngaged = ({ recency, setRecency }: NewsletterContextProps) =>
  setRecency({ ...recency, previouslyEngaged: true });

const naggedRecently = ({ activeNag, lastNagged }: NagRecency) =>
  activeNag
    ? true
    : lastNagged
      ? new Date().getMilliseconds() - lastNagged.getMilliseconds() <
        maximumNagFrequencyMillis
      : false;

export const Nag = ({
  id,
  medium,
  onClick,
  onDismiss,
}: {
  id: string;
  medium: string;
  onClick: () => void;
  onDismiss: () => void;
}) => {
  const context = useContext(NewsletterContext);
  const { user } = useContext(UserContext);
  const [visible, setVisible] = useState(false);

  const campaignVariants = variants[context.campaign];
  const [variant, _] = useState(
    campaignVariants.length > 0
      ? Math.floor(Math.random() * campaignVariants.length)
      : null,
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      setVisible(true);
    });
  }, []);

  if (variant === null) {
    return null;
  } else {
    return (
      <div className={`suggestion-overlay${visible ? " entered" : ""}`}>
        <a
          id={id}
          target="_blank"
          rel="noopener"
          href={newsletterLink(context, medium, user)}
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
      </div>
    );
  }
};

export const NagOpportunity = ({
  children,
  initialActivation,
  medium,
}: {
  children: any;
  initialActivation?: boolean;
  medium: string;
}) => {
  const nagContext = useContext(NewsletterContext);
  const id = useId();

  useEffect(() => {
    if (initialActivation) {
      trigger(id, nagContext);
    }
  }, [initialActivation]);

  return (
    <div className="suggestion-anchor" onClick={() => trigger(id, nagContext)}>
      {children}
      {nagContext.recency.activeNag === id ? (
        <Nag
          id={id}
          medium={medium}
          onClick={() =>
            nagContext.setRecency({
              activeNag: null,
              previouslyEngaged: true,
              lastNagged: new Date(),
            })
          }
          onDismiss={() => dismiss(id, nagContext)}
        />
      ) : null}
    </div>
  );
};
