import React from "react";
import { useRouterContext, useLink, useRouterType } from "@refinedev/core";
import MuiLink from "@mui/material/Link";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import type { RefineLayoutThemedTitleProps } from "@refinedev/mui";
import brickbix from '../../assets/brick-bix.png';
const defaultText = "BrickBix";
import { Button } from "@mui/material";

const defaultIcon = brickbix;

export const Title: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  wrapperStyles,
  icon = defaultIcon,
  text = defaultText,
}) => {
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  return (
    <MuiLink
      to="/"
      component={ActiveLink}
      underline="none"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        ...wrapperStyles,
      }}
    >
     
     <Button  fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={brickbix} alt="BrickBix" width="28px" />
        ) : (
          <img style={{marginLeft:'50px', marginTop: "10px" }} src={brickbix} alt="BrickBix" width="65px" />
        )}
      </Link>
    </Button>
    </MuiLink>
  );
};
