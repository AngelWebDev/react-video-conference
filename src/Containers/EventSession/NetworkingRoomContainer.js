import React, { useEffect } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { leaveCall } from "../../Modules/eventSessionOperations";

import { useSelector, shallowEqual } from "react-redux";
import {
  getUser,
  getUserGroup,
  getSessionId,
  getUserId,
  getEventSessionDetails,
  getFeatureDetails
} from "../../Redux/eventSession";
// import JitsiContext from "../../Contexts/JitsiContext";
import { trackPage, trackEvent } from "../../Modules/analytics";
import {
  getJistiServer,
  // getJitsiOptions,
  getJistiDomain,
  isMeetJitsi
} from "../../Modules/jitsi";
import { FEATURES } from "../../Modules/features";
// import { usePrevious } from "react-use";
// import TechnicalCheckContext from "../../Contexts/TechnicalCheckContext";
import AudioVideoCheckDialog from "../../Components/EventSession/AudioVideoCheckDialog";
import useJitsi from "../../Hooks/useJitsi";
// import TechnicalCheckContext from "./TechnicalCheckContext";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%"
  }
}));

const NetworkingRoomContainer = () => {
  const classes = useStyles();
  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const currentGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);

  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const removeJitsiLogoFeature = useSelector(
    getFeatureDetails(FEATURES.REMOVE_JITSI_LOGO),
    shallowEqual
  );

  const [loaded, error] = useScript(
    (currentGroup && currentGroup.customJitsiServer
      ? getJistiServer(currentGroup)
      : getJistiServer(eventSessionDetails)) + "external_api.js"
  );

  useEffect(() => {
    trackPage("NetworkingRoom/" + sessionId);
    trackEvent("Entered Networking Room", {
      eventSessionId: sessionId
    });
  }, [sessionId]);

  const handleCallEnded = React.useCallback(() => {
    leaveCall(sessionId, currentGroup, userId);
  }, [sessionId, currentGroup, userId]);


  // Initialize Jitsi Player
  const domain = currentGroup && currentGroup.customJitsiServer ? getJistiDomain(currentGroup): 
  getJistiDomain(eventSessionDetails);
  
  const showJitsiLogo = isMeetJitsi(domain) && (!removeJitsiLogoFeature || !removeJitsiLogoFeature.enabled);
  
  let subject = "";
  if (currentGroup.isRoom) {
    subject = `Room | ${currentGroup.roomName}`;
  } else {
    subject = "Networking Conversation";
  }

  let prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
  let prefixStr = prefix !== undefined ? `${prefix}-` : "";

  const roomName = currentGroup.videoConferenceAddress.includes("http")
  ? prefixStr +
    currentGroup.videoConferenceAddress.replace("https://meet.jit.si/", "")
  : prefixStr + currentGroup.videoConferenceAddress;

  const handleVideoConferencingJoined = () => {
    trackEvent("[Jitsi] Joined Call", {
      eventSessionId: sessionId,
      roomName
    });
  }

  const handleVideoConferencingLeft = () => {
    trackEvent("[Jitsi] Left Call (videoConferenceLeft)", {
      eventSessionId: sessionId,
      roomName
    });
    handleCallEnded();
  }

  const handleCallEndedCb = () => {
    trackEvent("[Jitsi] Left Call (readyToClose)", {
      eventSessionId: sessionId,
      roomName
    });
    handleCallEnded();
  }

  useJitsi({
    avatarUrl: user.avatarUrl,
    displayName: user.firstName + " " + user.lastName,
    sessionId,
    containerId: "#conference-container",
    domain,
    showJitsiLogo,
    subject,
    roomName,
    onVideoConferenceJoined: handleVideoConferencingJoined,
    onVideoConferenceLeft: handleVideoConferencingLeft,
    callEndedCb: handleCallEndedCb,
  });

  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return <div id="conference-container">Loading...</div>;
  if (loaded) {
    return (
      <>
        <div className={classes.root} id="conference-container" />

          {/* <JitsiPlayerComponent 
            avatarUrl= {user.avatarUrl}
            displayName={user.firstName + " " + user.lastName}
            sessionId={sessionId}
            containerId="#conference-container"
            domain={domain}
            showJitsiLogo={showJitsiLogo}
            subject={subject}
            roomName={roomName}
            onVideoConferenceJoined={handleVideoConferencingJoined}
            onVideoConferenceLeft={handleVideoConferencingLeft}
            callEndedCb= {handleCallEndedCb}
          />           */}
        <AudioVideoCheckDialog
          title={currentGroup.isRoom ? `${currentGroup.roomName} Room` : "Networking Conference call"}
          subtitle={"You are going into video call. Please ensure that mic and camera are working properly."}
          sessionId={sessionId}
          showClose
          onCloseClicked={handleCallEnded}
        />
      </>
    )
  }
};
// NetworkingRoomContainer.whyDidYouRender = true;
export default NetworkingRoomContainer;
