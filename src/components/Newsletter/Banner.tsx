import React, { useContext } from "react";
import { newsletterLink } from "../../config";
import { NewsletterNagContext } from "./Nag";

import './Banner.scss';

export const Banner = () => {
  const context = useContext(NewsletterNagContext);

  return (<div className="suggestion-bar">
    <a
      target="_blank"
      rel="noopener"
      href={newsletterLink}
      onClick={() => context.setRecency({ ...context.recency, previouslyEngaged: true })}
    >
      <span>🎉 Community Giveaway 🎉:</span>
      <span>Join our newsletter for a chance to win $100! <span className="call-to-action">Click here</span>.</span>
      <span>Winner will be drawn on <time dateTime="2024-10-21T11:59:00.000-08:00">10/21/2024</time>.</span>
    </a>
  </div>)
};
