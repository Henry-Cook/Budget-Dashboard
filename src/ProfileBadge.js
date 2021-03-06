import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginTop: "10px",
    marginRight: "20px",
    color: "#ffb766",
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginTop: "2px",
    marginRight: "5px",
    color: "#ffb766",
  },
}));

function ProfileBadge() {
  const matches = useMediaQuery("(max-width:850px)");
  const classes = useStyles();
  return (
    <>
      {/* <Avatar
        className=
        alt="Remy Sharp"
        src="https://avatars1.githubusercontent.com/u/58886842?s=460&u=e69868586df6f4d3d8f6f629eeb26920d6e6aafd&v=4"
      /> */}
      <AccountBalanceWalletIcon
        fontSize="large"
        className={matches === true ? classes.small : classes.large}
      />
    </>
  );
}

export default ProfileBadge;

//https://avatars1.githubusercontent.com/u/58886842?s=460&u=e69868586df6f4d3d8f6f629eeb26920d6e6aafd&v=4
