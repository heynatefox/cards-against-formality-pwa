import React, { useContext, useState } from "react";
import { hasEngaged } from "./Nag";
import { UserContext } from "../../Contexts/UserProvider";
import { menuVariants, newsletterLink } from "./Campaigns";
import { MenuItem, Button } from "@material-ui/core";
import { NewsletterContext } from "./Context";

export const MenuButton = ({ medium }: { medium: string }) => {
  const context = useContext(NewsletterContext);
  const { user } = useContext(UserContext);

  const campaignVariants = menuVariants[context.campaign];
  const [variant, _] = useState(
    campaignVariants.length > 0
      ? Math.floor(Math.random() * campaignVariants.length)
      : null,
  );

  if (variant === null) {
    return null;
  } else {
    return (
      <MenuItem
        onClick={() => {
          window.open(newsletterLink(context, medium, user));
          hasEngaged(context);
        }}
      >
        <Button color="secondary" variant="contained">
          {campaignVariants[variant]}
        </Button>
      </MenuItem>
    );
  }
};
