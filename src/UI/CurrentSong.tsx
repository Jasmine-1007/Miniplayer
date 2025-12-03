import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSong, getCurrentSyncedLyric, getProgress } from "../functions/functions";
import CurrentLine from "./CurrentLine";
import type { Song } from "../functions/functions";
import { useCurrentSong } from "../functions/Hooks";
import { useGetProgress } from "../functions/Hooks";
import { useGetSyncedLyrics } from "../functions/Hooks";


function CurrentSong(props: {className? :string, token : string | null}) {
  const access_token = localStorage.getItem("Access_token");


  const [lastTitle, setLastTitle] = useState("");
  const [lastArtist, setLastArtist] = useState([""]);
  const [lastCover, setLastCover] = useState("");

  const [titleOverflow, setTitleOverflow] = useState(false);
  const [artistOverflow, setArtistOverflow] = useState(false);


  const titleRef = useRef<HTMLParagraphElement>(null);
  const artistRef = useRef<HTMLParagraphElement>(null);

  
  let lastLine : string;
  let subLine = "Paused...";
  // 1️⃣ Fetch current song
  // const {
  //   data: current,
  //   isPending: songPending,
  //   error: songError,
  // } = useQuery<Song>({
  //   queryKey: ["currentSong"],
  //   queryFn: () => getCurrentSong(access_token),
  //   refetchInterval: 1000, // refresh every 3 seconds
  // });

  // const {
  //   data: progress = 0,
  //   isPending: progressPending,
  //   error: progressError,
  // } = useQuery({
  //   queryKey: ["Progress"],
  //   queryFn: () => getProgress(access_token),
  //   refetchInterval: 900, // refresh every 3 seconds
  //   enabled: !!access_token && !!current?.is_playing,
  // });

  // // 2️⃣ Fetch synced lyrics (after song is loaded)
  // const {
  //   data: syncedLyrics,
  //   isPending: syncedPending,
  //   error: lyricsError,
  // } = useQuery({
  //   queryKey: ["syncedLyric", current?.name],
  //   queryFn: () =>
  //     getCurrentSyncedLyric(current ? JSON.stringify(current) : ""),
  //   enabled: !!current, // only run when song is available
  // });


 
const {
    data: current,
    isPending: songPending,
    error: songError,
  } = useCurrentSong(props.token);


 const {
    data: progress = 0,
    isPending: progressPending,
    error: progressError,
  } = useGetProgress(props.token, current?.is_playing || false); 

  const {
    data: syncedLyrics,
    isPending: syncedPending,
    error: lyricsError,
  } = useGetSyncedLyrics(props.token, current || null);


   

  useEffect(()=> {
    
    if (current && current.name) {
      setLastTitle(current.name);
      setLastArtist(current.artists || []);
      setLastCover(current.coverUrl);

    }
    

  }, [current, songError]);


  const displayTitle = current?.is_playing ? current.name : lastTitle;
  const displayCover = current?.is_playing ? current.coverUrl : lastCover;
  const displayArtists = current?.is_playing ? current.artists.join(", ") : lastArtist.join(", ");





  useLayoutEffect(()=> {
    const handleOverflow = ()=> {
    if(titleRef.current){
      console.log("detecting overflow");

      const prevPosition =  titleRef.current.style.position;
      titleRef.current.style.position = "static";
      console.log(titleRef.current.scrollWidth);
      console.log(titleRef.current.clientWidth);


      setTitleOverflow(titleRef.current.scrollWidth > titleRef.current.clientWidth);
      titleRef.current.style.position = prevPosition;
    }
    if(artistRef.current){

      const prev = artistRef.current.style.position;
      artistRef.current.style.position  = "static";
      setArtistOverflow(artistRef.current.scrollWidth > artistRef.current.clientWidth);
      artistRef.current.style.position = prev;

    }
  };
  handleOverflow();

    window.addEventListener("resize", handleOverflow);
    return window.removeEventListener("resize", handleOverflow)

  }, [displayTitle, displayArtists]);

  if (songPending) return <div>Loading current song...</div>;
  if (songError) return <div>Error loading current song...</div>;



  return (
    <div className={props.className}>
      <div className="w-[90vw] max-w-[600px] h-25 my-[6vh] bg-gray-200/50 flex justify-between items-center rounded-sm">
        <div className="flex-1 flex gap-[2vh] bg-black/75 h-full items-center px-2">
          <img src={displayCover} className="w-15 rounded-sm"></img>
          <div className="relative text-xs overflow-hidden w-1/2 h-10">
            <p ref={titleRef} className={`font-bold ${titleOverflow ? "animate-marquee" : ""} whitespace-nowrap`} 
            style={{ position: 'absolute', top: 2, left: 0 }}>{displayTitle}</p>
            
          
            <p ref={artistRef} className={` ${artistOverflow ? "animate-marquee" : ""} whitespace-nowrap`}
            style={{position: 'absolute', top: 20, left: 0}}>
              {displayArtists}</p>
          </div>
          </div>

          <div className="m-[1vh] flex-2 ">
            {syncedPending && current?.is_playing ? <div>Loading synced lyrics...</div> :
            current?.is_playing ? (
            <CurrentLine syncedlyrics={syncedLyrics?.syncedLyrics} progress={progress} />
          ) : (
            <p className="text-s">Paused...</p>
          )}
          </div>
        
      </div>
      
      
      
      {lyricsError && <div>Error loading synced lyrics</div>}

       </div>
  );
}


export default CurrentSong;
      


{/* premium feature */}

      {/* <p>If you have Spotify Premium, try:</p>
      <button className=""
        onClick={async () => {
          const access_token = localStorage.getItem("Access_token");
          const res = await fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          });
        }}
      >
        Next
      </button>

      <button
        onClick={async () => {
          const access_token = localStorage.getItem("Access_token");
          const res = await fetch(
            "https://api.spotify.com/v1/me/player/pause",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }}
      >
        Pause
      </button> */}
   
