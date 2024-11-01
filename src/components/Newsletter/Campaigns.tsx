import React, { ReactNode } from 'react';

import { Typography } from "@material-ui/core";
import { newsletterBaseLink } from '../../config';
import { UserContextInterface } from '../../Contexts/UserProvider';
import { NewsletterContextProps } from './Context';

export const variants = {
  newsletter: [
    (<>
      <Typography variant="subtitle1">Interested in other fun stuff?</Typography>
      <Typography variant="subtitle2"><span className="call-to-action">Join our newsletter</span>!</Typography>
    </>),
  ],
  giveaway: [
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
  ],
} as const;

export type Campaign = keyof (typeof variants);

export const bannerVariants = {
  newsletter: [],
  giveaway: [
    (<>
      <span>🎉 Community Giveaway 🎉:</span>
      <span>Join our newsletter for a chance to win $100! <span className="call-to-action">Click here</span>.</span>
      <span>Winner will be drawn on <time dateTime="2024-10-21T11:59:00.000-08:00">10/21/2024</time>.</span>
    </>),
  ],
} as const satisfies { [campaign in Campaign]: ReactNode[] };

export const menuVariants = {
  newsletter: ["Get our newsletter"],
  giveaway: ["Enter to win $100"],
} as const satisfies { [campaign in Campaign]: ReactNode[] };

export const newsletterLink = (context: NewsletterContextProps, medium: string, user: UserContextInterface["user"]): string => {
  const link = new URL(newsletterBaseLink);
  link.searchParams.set("utm_source", "caf");
  link.searchParams.set("utm_medium", medium);
  link.searchParams.set("utm_campaign", context.campaign);
  if (user?.email) {
    link.searchParams.set("email", user.email);
  }
  return link.toString();
}
