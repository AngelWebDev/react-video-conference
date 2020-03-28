import React from "react";
import { makeStyles } from "@material-ui/styles";

import { isProd, isDev } from "modules/environment";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  cornerRibbon: {
    width: "100px",
    background: "#e43",
    top: "14px",
    left: "-24px",
    textAlign: "center",
    lineHeight: "20px",
    letterSpacing: "1px",
    color: "#f0f0f0",
    transform: "rotate(-45deg)",
    "-webkit-transform": "rotate(-45deg)",
    boxShadow: "0 0 3px rgba(0,0,0,.3)",
    position: "fixed",
    zIndex: 10000
  },
  ribbonStage: {
    background: theme.palette.secondary.main
  },
  ribbonOrange: {
    background: "#e82"
  },
  text: {
    textTransform: "uppercase"
  }
}));

const EnvironmentRibbon = props => {
  const classes = useStyles();

  if (isProd()) return null;

  if (isDev()) {
    return (
      <div className={`${classes.cornerRibbon} ${classes.ribbonOrange}`}>
        <Typography color="inherit" className={classes.text}>
          Dev
        </Typography>
      </div>
    );
  }
  return (
    <div className={`${classes.cornerRibbon} ${classes.ribbonStage}`}>
      <Typography color="inherit" className={classes.text}>
        Demo
      </Typography>
    </div>
  );
};

export default EnvironmentRibbon;
