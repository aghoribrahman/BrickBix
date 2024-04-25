import React from "react";
import {
  useGetIdentity,
  useActiveAuthProvider,
  pickNotDeprecated,
} from "@refinedev/core";
import { HamburgerMenu } from "./hamburgerMenu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import brickbix from '../../assets/brick-bix.png';

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  isSticky,
  sticky,
}) => {
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const prefferedSticky = pickNotDeprecated(sticky, isSticky) ?? true;

  return (
    <AppBar elevation={1} position={prefferedSticky ? "sticky" : "relative"}>
  <Toolbar sx={{ display: 'flex', alignItems: "center", backgroundColor: "#FCFCFC" }}>
    <HamburgerMenu />
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', marginRight: '20px', }}>
      <img style={{ maxWidth: '45px'}} src={brickbix} alt="" />
    </Box>
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {/* {user?.name} */}
        {/*{user?.name && (
          <Typography style={{ fontWeight: "bold", fontSize: '12px' }} color="textPrimary" variant="subtitle2" data-testid="header-user-name">
            {user?.name}
          </Typography>
        )}*/}
        {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
      </Stack>
    </Stack>
  </Toolbar>
</AppBar>


  );
};
