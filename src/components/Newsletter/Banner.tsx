import React, { useContext, useState } from "react";
import { NewsletterNagContext } from "./Nag";
import { UserContext } from "../../Contexts/UserProvider";
import { UTM, bannerVariants, newsletterLink } from './Campaigns';

import './Banner.scss';

export const Banner = ({ utm }: { utm: UTM }) => {
  const context = useContext(NewsletterNagContext);
  const { user } = useContext(UserContext);

  const campaignVariants = bannerVariants[utm.campaign];
  const [variant, _] = useState(Math.floor(Math.random() * campaignVariants.length));

  const link = newsletterLink(utm, user);

  return (<div className="suggestion-bar">
    <a
      target="_blank"
      rel="noopener"
      href={link}
      onClick={() => context.setRecency({ ...context.recency, previouslyEngaged: true })}
    >
      {campaignVariants[variant]}
    </a>
  </div>)
};
