import React, { useState, useEffect } from "react";
import { parseLyric } from "../functions/functions";
import { getCurrentLine } from "../functions/functions";

//define the props type for component
type CurrentLineProps = {
  syncedlyrics?: string;
  progress?: number;
};

function CurrentLine({ syncedlyrics = "", progress = 0 }: CurrentLineProps) {
  const [currentline, setCurrentLine] = useState("");

  useEffect(() => {
    //parse the lyrics first into desired format with parseLyric function
    const parsed = parseLyric(syncedlyrics || "");

    //define and set a timeout to make sure the parsing gets done first before confirming no lyric
    let timeOutID: ReturnType<typeof setTimeout> | null;

    timeOutID = setTimeout(() => {
      if (parsed.length === 0) {
        setCurrentLine("Sorry, no lyrics found for this song.");
      }
    }, 1000);

    //if there is actual lyric then get the current line with custom function
    if (parsed.length) {
      const current = getCurrentLine(parsed, progress);

      if (current && current != currentline) {
        if (timeOutID) clearTimeout(timeOutID);
        setCurrentLine(current);
      }
    }

    return () => {
      if (timeOutID) clearTimeout(timeOutID);
    };
  }, [progress, syncedlyrics]);

  return (
    <div>
      <div>{currentline}</div>
    </div>
  );
}
export default CurrentLine;
