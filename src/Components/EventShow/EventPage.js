import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MUIRichTextEditor from "mui-rte";
import { CardMedia, Button } from "@material-ui/core";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import routes from "../../Config/routes";
import { useHistory } from "react-router-dom";
import { DEFAULT_EVENT_OPEN_MINUTES } from "../../Config/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
  },
}));

export default function EventPage(props) {
  let { bannerUrl, eventBeginDate, eventEndDate, title, description, website, id, eventOpens } = props.event;
  const history = useHistory();

  let beginDate = eventBeginDate ? moment(eventBeginDate.toDate()) : null;
  let endDate = eventEndDate ? moment(eventEndDate.toDate()) : null;

  const classes = useStyles();
  const isSameDay = beginDate ? beginDate.isSame(endDate, "day") : false;

  const isLive = React.useMemo(() => {
    if (!eventBeginDate) {
      return true;
    }
    let openMinutes = eventOpens ? Number(eventOpens) : DEFAULT_EVENT_OPEN_MINUTES;
    let beginDate = moment(eventBeginDate.toDate());

    return beginDate.subtract(openMinutes, "minutes");
  }, [eventBeginDate, eventOpens]);

  return (
    <Card className={classes.root}>
      {bannerUrl && bannerUrl.trim() !== "" && (
        <CardMedia component="img" alt={title} image={bannerUrl} title={title} />
      )}
      {(!bannerUrl || bannerUrl.trim() === "") && (
        <CardMedia component="img" alt={title} image="/DefaultEventBanner.svg" title={title} />
      )}
      <div style={{ padding: 32 }}>
        <Typography variant="h4" color="primary" align="left" style={{ marginBottom: 24 }}>
          {title}
        </Typography>

        <Grid container justify="space-between" className={classes.textField}>
          <div>
            {beginDate && (
              <Typography color="textSecondary">
                <span role="img" aria-label="calendar">
                  📅
                </span>
                {isSameDay
                  ? beginDate.format("lll") + " to " + endDate.format("LT")
                  : beginDate.format("lll") + " to " + endDate.format("lll")}
              </Typography>
            )}
            {website && website.trim() !== "" && (
              <Typography color="textSecondary">
                <a href={website} target="_blank">
                  <span role="img" aria-label="website">
                    🔗
                  </span>
                  {website}
                </a>
              </Typography>
            )}
          </div>
          <div>
            {!isLive && (
              <Button variant="contained" color="primary" disableElevation disabled>
                Add to calendar
              </Button>
            )}
            {isLive && (
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => history.push(routes.EVENT_SESSION_LIVE(id))}
              >
                Go to the event
              </Button>
            )}
          </div>
        </Grid>
        {description && description.trim() !== "" && (
          <div style={{ marginTop: 24 }}>
            <MUIRichTextEditor
              value={description}
              readOnly={true}
              placeholder="No description available"
              toolbar={false}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
