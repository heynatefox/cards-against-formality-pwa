import React, { ReactNode } from "react";

import { Typography } from "@material-ui/core";
import { UserContextInterface } from "../../Contexts/UserProvider";
import { NewsletterContextProps } from "./Context";
import badCardsLogo from "./bad-cards.svg";

export const variants = {
  newsletter: [
    <>
      <Typography variant="subtitle1">
        Interested in other fun stuff?
      </Typography>
      <Typography variant="subtitle2">
        <span className="call-to-action">Join our newsletter</span>!
      </Typography>
    </>,
  ],
  giveaway: [
    <>
      <Typography variant="subtitle1">
        Interested in other fun stuff?
      </Typography>
      <Typography variant="subtitle2">
        <span className="call-to-action">Join our newsletter</span> for a chance
        to win $100!
      </Typography>
    </>,
    <>
      <Typography variant="subtitle2">
        Celebrate 4 years of CAF and enter to win $100!{" "}
        <span className="call-to-action">Click here</span>.
      </Typography>
    </>,
    <>
      <Typography variant="subtitle2">
        Help us build a community pack and enter to win $100 by{" "}
        <span className="call-to-action">joining our newsletter</span>.
      </Typography>
    </>,
    <>
      <Typography variant="subtitle1">Like free shit?</Typography>
      <Typography variant="subtitle2">
        <span className="call-to-action">Join our newsletter</span> and enter to
        win $100.
      </Typography>
    </>,
    <>
      <Typography variant="subtitle1">
        <span className="call-to-action">Click here</span> if you like free
        shit.
      </Typography>
    </>,
  ],
  ["bad-cards"]: [
    <>
      <Typography variant="subtitle1">
        We've developed a ton more games to play!
      </Typography>
      <Typography variant="subtitle2">
        <span className="call-to-action">
          Play our other party games at Bad Cards
        </span>
        !
      </Typography>
    </>,
  ],
} as const;

export type Campaign = keyof typeof variants;

export const bannerVariants = {
  newsletter: [],
  giveaway: [
    <>
      <span>🎉 Community Giveaway 🎉:</span>
      <span>
        Join our newsletter for a chance to win $100!{" "}
        <span className="call-to-action">Click here</span>.
      </span>
      <span>
        Winner will be drawn on{" "}
        <time dateTime="2024-10-21T11:59:00.000-08:00">10/21/2024</time>.
      </span>
    </>,
  ],
  ["bad-cards"]: [
    <>
      <span>🎉 New Games 🎉:</span>
      <span>
        <span>We've developed a ton more games to play!</span>{" "}
        <span>
          Play our other party games at{" "}
          <span className="call-to-action">Bad Cards</span>
        </span>
        !
      </span>
    </>,
  ],
} as const satisfies { [campaign in Campaign]: ReactNode[] };

export const menuVariants = {
  newsletter: ["Get our newsletter"],
  giveaway: ["Enter to win $100"],
  ["bad-cards"]: ["Play our other games!"],
} as const satisfies { [campaign in Campaign]: ReactNode[] };

export const loginVariants = {
  newsletter: [
    <img
      src="data:image/avif;base64,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"
      alt="WTF Weekly"
    />,
  ],
  giveaway: [
    <img
      src="data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAABB1tZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAARBAAEAAAAAAAAA7AABAAAAAAUtAAEAAAAAAAADtwAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAADXGlwcnAAAAM2aXBjbwAAAqxjb2xycHJvZgAAAqBsY21zBEAAAG1udHJSR0IgWFlaIAfoAAoAHQATACQAG2Fjc3BBUFBMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtbGNtcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWRlc2MAAAEgAAAAQGNwcnQAAAFgAAAANnd0cHQAAAGYAAAAFGNoYWQAAAGsAAAALHJYWVoAAAHYAAAAFGJYWVoAAAHsAAAAFGdYWVoAAAIAAAAAFHJUUkMAAAIUAAAAIGdUUkMAAAIUAAAAIGJUUkMAAAIUAAAAIGNocm0AAAI0AAAAJGRtbmQAAAJYAAAAJGRtZGQAAAJ8AAAAJG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAJAAAABwARwBJAE0AUAAgAGIAdQBpAGwAdAAtAGkAbgAgAHMAUgBHAEJtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABoAAAAcAFAAdQBiAGwAaQBjACAARABvAG0AYQBpAG4AAFhZWiAAAAAAAAD21gABAAAAANMtc2YzMgAAAAAAAQxCAAAF3v//8yUAAAeTAAD9kP//+6H///2iAAAD3AAAwG5YWVogAAAAAAAAb6AAADj1AAADkFhZWiAAAAAAAAAknwAAD4QAALbEWFlaIAAAAAAAAGKXAAC3hwAAGNlwYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKW2Nocm0AAAAAAAMAAAAAo9cAAFR8AABMzQAAmZoAACZnAAAPXG1sdWMAAAAAAAAAAQAAAAxlblVTAAAACAAAABwARwBJAE0AUG1sdWMAAAAAAAAAAQAAAAxlblVTAAAACAAAABwAcwBSAEcAQgAAAAxhdjFDgQAcAAAAABRpc3BlAAAAAAAAAGQAAABHAAAADnBpeGkAAAAAAQgAAAA4YXV4QwAAAAB1cm46bXBlZzptcGVnQjpjaWNwOnN5c3RlbXM6YXV4aWxpYXJ5OmFscGhhAAAAAAxhdjFDgQAMAAAAABBwaXhpAAAAAAMICAgAAAAeaXBtYQAAAAAAAAACAAEEAYYDBwACBIIDBIUAAAAaaXJlZgAAAAAAAAAOYXV4bAACAAEAAQAABKttZGF0EgAKBhgZscZlUDLfARIAEGBfANASHHGBgva9lLTdNytvjjsWo7YsHXEKGYkK6XZ2/h24PoMaw8b+ZVOGIQiBy1IVWpx26KTSXBYd2DYrIh7f3qRox+ig94VkElyb/AegUeXdbZQoHYlMwVS3p0zh4WRTs8ocvwG62SAZub2mdgBHJzb0SjZyBc7WPYwexu+D0Q+7J7iG1u90zNp69xSEoDh8Lygb8u8zw4AD8SXvhNlVJu0m1eK4/QPRanMQd7eDAXy+ec2zrUrYiCqeaTE8OYeqHyMrZeO61wqzDSsZnmcmLhnPf7u2NREoY58SAAoJGBmxxmSAhoNCMqcHEgAGHBABYcDP2+o5RT9egbcscfD20kryLdH2uQDZ+jXIMjCJdD+k7dqAspU2QgTUsgxb6sM41lA4lnFmOvM43JXtCzaDhaK3WZiF9/0YbUr+4nLUy2CwJh90ngO+D+4WlCnQpwQH4hOXRkYy/e0j1+DyUUuCakc3ElfprSHHYoLSIJjTSrKitkQwEDlrf6V0plKj1jMF1BMNfrG4c5B/IvMT6H7Fx6ZMc7aGbg2BlDVsyU9gXRgmGxMvxAmZX+7iG4cI1BXy4aQWiw9aFaSaoDj/KBY21Yq1FXiobr57LCo+WQadTqZ+U/8GJskQSHwdaJhlUQAXnVsgUfRlcXYwK+PcwNnFSCD4wZezNyDgBoRMeHeowYBsvVINDvpDRml0u2FNqoH5jNQtfHPj366eyjVsxlg63rr22nYxPl6LfQgoMyuV7VKAeT5WOM9YPK54/2YeKuA4/SgJggvJPmfavkT41DVmhJg9Dsw0y/uGBNnBD9Me06tB2ZmFFFdHIoB8BvFO2erTYv3Iw/YmsUS3ZcWZX2nK7R0myuwoZW31xcU/wrfqtBWoo9MCmsRy/CL6Q5MdlqDMYRjroy4PzIgXIaoYMeVUXwKoW+4D4bI3F3kcXXqfKvktkIopZe4G5GgWAutDwNpHJUYkxofqUTquCD4nKPS+p0YrPdg63ZCToiEpfYsCJjjTMkqhEXOC3urHXWWPOyFPca6rbsuVLKoxla38PTno+PPTog+EY7OjQsYzUq1Ctc0ts3yKTfKHcSKP2EWAv8xM8P779mD8Pxl2/UPHChXee8YrAk+hl8crIbC67BM3tKriX+Ixr0M7s4gHg7zDlE/nO8s92SR/95+CCNDPQoUkeCfj4V2oYl5U5kusQysExlA6B607gDHlS9iGEJ7HAfxhQBw1ZV8PAtjFB6kdTxyGZ6nNeuNc0Nl3xGmIiv4fzUcvCowKLaXPvUchIH4guo2PflgwJv6ngsTU2nm5sIpNGevq7zl7Vb0MBA4jqQq7FuxyG19n1nIWWwu/BivyChdBNTJ3nY0Qps7W0jPIUPZaeK1J0Sd479tooBZ3gYHwIqTpzQpYhmIXB8+m2+kL6zlonU3YkXXKGsAzPidU37E5wWUleXhtJKIVq5e2a8VE8ddHlvM5iFmo7lseyQAmRRKdZNJYz7rWc2gttZhpcUQ5Gl9kJh3Iumd3UgO9to9gtt17ZAuy1orLx6tchRC+29Ev0HEi6ojJMqDeo+i/JCM3jsA="
      alt="WTF Weekly"
    />,
  ],
  ["bad-cards"]: [
    <img className="bad-cards" src={badCardsLogo} alt="Bad Cards" />,
  ],
};

export const unknownCampagin = (campaign: never): never => {
  throw new Error(`Unknown campaign given: ${campaign}`);
};

export const campaignLink = (
  campaign: Campaign,
  context: NewsletterContextProps,
  medium: string,
  user: UserContextInterface["user"],
): string => {
  switch (campaign) {
    case "newsletter":
    case "giveaway":
      const link = new URL(
        "https://magic.beehiiv.com/v1/750e27e5-1969-4d4a-9097-3f0504f990e7",
      );
      link.searchParams.set("utm_source", "caf");
      link.searchParams.set("utm_medium", medium);
      link.searchParams.set("utm_campaign", context.campaign);
      if (user?.email) {
        link.searchParams.set("email", user.email);
      }
      return link.toString();
    case "bad-cards":
      return "https://bad.cards/";
    default:
      return unknownCampagin(campaign);
  }
};
