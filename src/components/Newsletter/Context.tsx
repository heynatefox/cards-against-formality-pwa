import React from "react";
import { Campaign } from "./Campaigns";

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

export interface NewsletterContextProps {
  // The currently active campaign.
  campaign: Campaign;
  // The recency of user interaction with the campaign.
  recency: NagRecency;
  setRecency: (receny: NagRecency) => void;
}

export const NewsletterContext = React.createContext<NewsletterContextProps>({
  campaign: "newsletter",
  recency: initialNagRecency,
  setRecency: () => {
    // If we don't have context, we can't do much.
  },
});
