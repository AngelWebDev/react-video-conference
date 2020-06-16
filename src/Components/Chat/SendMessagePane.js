import React, { useRef, useEffect, useState } from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import {
  IconButton,
  InputAdornment,
  Input,
  Box,
  useTheme
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
// import Picker from "emoji-picker-react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "white",
    height: "100%",
    display: "flex",
    alignItems: "center",
    // position: "relative",
  },
  message: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 8,
  },
  emojiContainer: {
    position: "absolute",
    right: 0,
  }
}));

export default (props) => {
  const { onMessageSendClicked } = props;
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [emojisShown, setEmojisShow] = useState(false);

  const pickerRef = useRef(null);
  const theme = useTheme();
  const textFieldRef = useRef(null);

  const [pickerRect, setPickerRect] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSendClicked(message);
    setMessage("");
  };

  const handleEmoticonClicked = (event) => {
    setEmojisShow(!emojisShown);
  }

  const handleCancel  = (event) =>  {
    if (event.clientX > pickerRect.left && event.clientX < pickerRect.right && event.clientY > pickerRect.top && event.clientY < pickerRect.bottom) {
      return;
    } else {
      setEmojisShow(false);
    }
  }

  useEffect(() => {
    if (pickerRef && pickerRef.current) {
      const pickerRect = pickerRef.current.getBoundingClientRect();
      setPickerRect(pickerRect, pickerRef);
    };
    
  }, [ pickerRef, setPickerRect])

  const handleEmojiSelect = (emoji) => {
    setMessage(`${message}${emoji.native}`);
    setEmojisShow(false);
    if (textFieldRef && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className={classes.root}>
      <div className={classes.message}>
        <Input
          inputRef={textFieldRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle emojis keyboard"
                  onClick={handleEmoticonClicked}
                >
                  <InsertEmoticonIcon />
                </IconButton>
              </InputAdornment>
            }
        ></Input>
      </div>
      
      <div className={classes.buttons}>
        <IconButton type="submit" aria-label="delete" className={classes.margin} color="primary">
          <SendIcon />
        </IconButton>
      </div>
    </form>

    <Box
        position="fixed"
        zIndex={4}
        bottom={30}
        height="100%"
        width="100%"
        bgcolor="transparent"
        visibility={emojisShown ? "visible" : "hidden"}
        onClick={handleCancel}>
          <Box
            ref={pickerRef}
            visibility={emojisShown ? "visible" : "hidden"}
            zIndex={4}
            position="absolute"
            bottom={20}
            left={40}
          >
            <Picker
              title="Select Emojis"
              color={theme.palette.secondary.main}
              onSelect={handleEmojiSelect}
            />
          </Box>
      </Box>
    </>
  );
};
