import { Box, IconButton } from "@mui/material";
import { FastForward, FastRewind, Pause, PlayArrow } from "@mui/icons-material";
import React, { Component, useCallback, useState } from "react";
import { theme } from "../components/theme";

export default function ControlBar({
  isPlaying,
  handlePlay,
  handleRewind,
  handleForward,
}) {
  return (
    <Box
      style={{
        position: "absolute",
        display: "flex",
        left: "50%",
        top: "48px",
        transform: "translate(-50%,0)",
      }}
    >
      <IconButton onClick={() => handleRewind()} color="primary" size="large">
        <FastRewind />
      </IconButton>
      <IconButton onClick={() => handlePlay()} color="primary" size="large">
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      <IconButton onClick={() => handleForward()} color="primary" size="large">
        <FastForward />
      </IconButton>
    </Box>
  );
}
