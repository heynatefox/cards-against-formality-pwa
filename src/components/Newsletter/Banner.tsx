import React, { useContext, useState } from "react";
import { hasEngaged } from "./Nag";
import { UserContext } from "../../Contexts/UserProvider";
import { bannerVariants, campaignLink } from "./Campaigns";

import "./Banner.scss";
import { NewsletterContext } from "./Context";

export const Banner = ({ medium }: { medium: string }) => {
  const context = useContext(NewsletterContext);
  const { user } = useContext(UserContext);

  const campaignVariants = bannerVariants[context.campaign];
  const [variant, _] = useState(
    campaignVariants.length > 0
      ? Math.floor(Math.random() * campaignVariants.length)
      : null,
  );

  if (variant === null) {
    return null;
  } else {
    return (
      <div className="suggestion-bar">
        <a
          target="_blank"
          rel="noopener"
          href={campaignLink(context.campaign, context, medium, user)}
          onClick={() => hasEngaged(context)}
        >
          {campaignVariants[variant]}
        </a>
      </div>
    );
  }
};
