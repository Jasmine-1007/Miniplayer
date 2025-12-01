import { QueryClient, useQueryClient } from "@tanstack/react-query";


export async function refreshToken (RefreshToken : string | null) {
    try {
      const response = await fetch(
        `http://127.0.0.1:4000/refresh?refresh_token=${RefreshToken}`
      );
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("Access_token", data.access_token);
        console.log("Token Refreshed!");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  export async function fetchToken (code: string) {
        try {
          const response = await fetch(
            `http://127.0.0.1:4000/callback?code=${code}`
          );

          const data: TokenResponse & { error?: any } = await response.json();
          console.log(data);
          // should print "object"

          if (data.error) {
            console.log(`Error: ${JSON.stringify(data.error)}`);
            return;
          }

          console.log(`Access token is ${data.access_token}`);
          console.log(`Refresh token is ${data.refresh_token}`);
          localStorage.setItem("Access_token", data.access_token);
          localStorage.setItem("Refresh_token", data.refresh_token);

          // refreshToken();
          const interval = setInterval(refreshToken, 55 * 60 * 1000);
          return () => clearInterval(interval);
        } catch (err: any) {
          console.error(err);
        } finally {
          // Clear the URL query string so old code isn't reused
          window.history.replaceState({}, document.title, "/callback");
        }
      };


export async function getCurrentSong(token: string | null){

    const response = await fetch (`http://127.0.0.1:4000/getCurrentSong?AccessToken=${token}`)
                const data = await response.json();
                console.log(data);

                return data;
}

export async function getProgress(token: string | null){
    if(!token) {console.log("No token found.")
        return 0;
    }

    const response = await fetch (`http://127.0.0.1:4000/getCurrentSong?AccessToken=${token}`)
                const data = await response.json();

                return data?.progress ?? 0;
}
export async function getCurrentLyric(title: string){
    if(!title){
        console.log("No title provided.");
        return "No title yet";
    }
    const response = await fetch (`http://127.0.0.1:4000/getCurrentLyric?title=${title}`);
    const data = await response.json();

    if (data.error) return `Error: ${data.error}`;
    return data.lyrics || "No lyrics found";
   

}

export async function getCurrentSyncedLyric(content: string){
    if(!content){
        console.log("No title provided.");
        return "No title yet";
    }
    const encoded = encodeURIComponent(content);
    const response = await fetch (`http://127.0.0.1:4000/getCurrentSyncedLyric?content=${encoded}`);
    if(!response.ok){
        const err = response.json().catch(()=> null);
        console.log("err", err)
        return err;

    }
    
    const data = await response.json();

    return data || "No Lyric";
   

}

export function parseLyric(syncedLyrics: string){
    const lines = syncedLyrics.split("\n");
    const parsed : {time: number; text: string}[] = [];
    for (const line of lines){
        if(!line) continue;
        const matched =line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
        if(!matched) continue;

        let minutes, seconds, text;
        if(matched[1] && matched[2] &&matched [3]){
        minutes= Number.parseInt(matched[1]);
        seconds = parseFloat(matched[2]);
        text = matched[3].trim() ?? "";
        }
if(minutes!== undefined && seconds!==undefined &&text !==undefined){
        const time = minutes*60 + seconds;
    parsed.push({time, text});
}

        

    }

    return parsed;

}

export interface Song {
  name: string;             // Track name
  artists: string[];        // List of artist names
  album: string;            // Album title
  coverUrl: string;         // Album art URL
  duration: number;         // Total length (in seconds)
  progress: number;         // Current position (in seconds)
  is_playing: boolean;  
  is_ad: boolean;    // Whether playback is active
}


export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  [key: string]: any; // optional, in case Spotify sends extra fields
}