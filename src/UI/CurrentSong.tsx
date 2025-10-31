import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentSong, getCurrentSyncedLyric } from '../functions/functions';
import CurrentLine from './CurrentLine';
import axios from 'axios';

function CurrentSong() {
  const access_token = localStorage.getItem("Access_token");

  // 1️⃣ Fetch current song
  const {
    data: current,
    isPending: songPending,
    error: songError
  } = useQuery({
    queryKey: ["currentSong"],
    queryFn: () => getCurrentSong(access_token),
    refetchInterval: 1000, // refresh every 3 seconds
  });

  // 2️⃣ Fetch synced lyrics (after song is loaded)
  const {
    data: syncedLyrics,
    isPending: syncedPending,
    error: lyricsError
  } = useQuery({
    queryKey: ["syncedLyric", current?.name],
    queryFn: () => getCurrentSyncedLyric(current ? JSON.stringify(current) : ""),
    enabled: !!current, // only run when song is available
  });

  console.log("synced lyrics:", syncedLyrics);


  // 3️⃣ Loading / error states
  if (songPending) return <div>Loading current song...</div>;
  if (songError) return <div>Error loading current song...</div>;

  // 4️⃣ Display
  return (
    <div>
      <h3>Current Song</h3>
      <div><b>Title:</b> {current?.name}</div>
      <div><b>Album:</b> {current?.album}</div>
      <div><b>Artists:</b> {current?.artists?.join(", ")}</div>
      <div><b>Duration:</b> {current?.duration}</div>
      <div><b>Current progress:</b>{current.progress} </div>
{current.is_playing ? (<>
<div>isplaying</div></>) : (
    <>
    <div>not playing</div></>
)
}
      {syncedPending && <div>Loading synced lyrics...</div>}
      {lyricsError && <div>Error loading synced lyrics</div>}

    <pre style={{ whiteSpace: "pre-wrap" }}>
  {(() => {
    if (!syncedLyrics) return "No synced lyrics found.";
    if (typeof syncedLyrics === "string") return syncedLyrics;
    if (typeof syncedLyrics === "object" && "syncedLyrics" in syncedLyrics)
      return syncedLyrics.syncedLyrics || "No synced lyrics found.";
    return "Not playing";
  })()}
</pre>

<CurrentLine syncedlyrics={syncedLyrics?.syncedLyrics || ""} progress = {current.progress} />

<p>If you have Spotify Premium, try:</p>
<button onClick={async ()=> {
    const access_token = localStorage.getItem("Access_token");
    const res = await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",},
    })
}}>Next</button>

<button onClick={async ()=> {
    const access_token = localStorage.getItem("Access_token");
    const res = await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "POST",
        headers: {Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",},
    })
}}>Pause</button>
    </div>
  );
}

export default CurrentSong;


