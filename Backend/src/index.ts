import express from "express";
import type {Request, Response} from "express";
import bodyParser from "body-parser";
import axios from "axios";
import type { AxiosResponse } from "axios";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import { createRoutesFromChildren } from "react-router-dom";
import { access } from "fs";


const app = express();
const port = 4000;

let RefreshToken:string;
let AccessToken:string;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env safely
dotenv.config({ path: path.resolve(__dirname, "../secrets.env") });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: "http://127.0.0.1:5173"}));

app.get("/login", (_req, res: Response)=> {

    const scope = "user-read-currently-playing%20user-read-playback-state";
    const redirect_url= `https://accounts.spotify.com/authorize?client_id=${
    process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI || "")}&scope=${scope}`;

    res.redirect(redirect_url);

})

app.get("/callback", async (req, res)=> {

    const code = req.query.code;

    if(!code) console.log("error getting code from frontend");
    console.log(`code is ${code}`);

    try {
        const response:AxiosResponse<any> = await axios.post(
          "https://accounts.spotify.com/api/token", null,
        {params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },});

        const {access_token, refresh_token} = response.data;

        console.log(`Access token is: ${access_token}`);
        console.log(`Refresh token is: ${refresh_token}`);
        RefreshToken = refresh_token;
        AccessToken = access_token;
        return res.json({access_token, refresh_token});
        // res.send("You have logged in successfully.")

    }catch(err:any){
        console.error(err.response?.data || err.message);
res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.get("/refresh", async (_req, res)=> {
  const refreshToken = _req.query.refresh_token || RefreshToken;
  if (!refreshToken) {
    console.log("❌ No refresh token available!");
    return res.status(400).json({ error: "No refresh token available" });
  }
  try {
    const response:AxiosResponse<any> = await axios.post("https://accounts.spotify.com/api/token",
      null, {params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }, headers:{
        "Content-Type": "application/x-www-form-urlencoded",
      },}  );

      const {access_token} = response.data;
      AccessToken = access_token;
      console.log(`refreshed token: ${access_token}`);
      return res.json({access_token});

    }catch(err:any){
     console.error(err.response?.data || err.message);
res.status(500).json({ error: err.response?.data || err.message }); 
    }
})

app.get("/getProfile", async (_req, res)=> {
  try{
    const AccessToken = _req.query.AccessToken;
    const response:AxiosResponse<any> = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${AccessToken}` 
      }
    });
    const {id, display_name, images} = response.data;
    const profileImage = images?.[0]?.url ?? "/photo/person.jpg";
    res.json({id, display_name, profileImage});



  }catch(err:any){
    console.error(err.response?.data ||err.message);
    res.status(500).json({error: err.response?.data || err.message});

     if (err?.err?.status === 401) {
      console.log("🔁 Token expired, attempting refresh...");
      try {
        const refreshResponse: AxiosResponse<any> = await axios.post(
          "https://accounts.spotify.com/api/token",
          null,
          {
            params: {
              grant_type: "refresh_token",
              refresh_token: RefreshToken,
              client_id: process.env.SPOTIFY_CLIENT_ID,
              client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        AccessToken = refreshResponse.data.access_token;

        const retry = await axios.get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${AccessToken}` },
        });

        const { id, display_name, images } = retry.data;
        const profileImage = images?.[0]?.url ?? "/photo/person.jpg";
        return res.json({ id, display_name, profileImage });
      } catch (refreshErr: any) {
        console.error("❌ Auto-refresh failed:", refreshErr.response?.data);
        return res.status(401).json({ error: "Token invalid or expired" });
      }
    }

  }
  
})


app.get("/getCurrentSong", async (_req, res)=> {
  try{

    const access_token = _req.query.AccessToken;
    console.log(access_token);
    const response:AxiosResponse<any> = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${access_token}`},
    });

    if (response.status === 204) {
  return res.json({ name: "Not playing", artists: [] });
}
    const {item, progress_ms, is_playing} = response.data;
    const progress = progress_ms/1000;
    // console.log(item);
    const name = item?.name ?? "Not playing";
const artists = item?.artists?.map((a: any) => a.name) ?? [];
const album = item.album.name ?? "Unknown album";
const duration = item.duration_ms ? Math.round(item.duration_ms/1000) : 0;
 return res.json({name, artists, album, duration, progress, is_playing});

}
catch(err: any){
  console.error("Error getting current song");
  return res.status(401).json({error: "Can;t get current song"});

}})


// app.get("/getCurrentSyncedLyric", async (_req, res)=> {
//   try{
//   if
//   const contentt = JSON.parse(_req.query.content);


// const { name, artists, album, duration } = contentt;

   

// const response:AxiosResponse<any> = await axios.get(`https://lrclib.net/api/get?artist_name=${artists}&track_name=${name}&album_name=${album}%duration=${duration}`)

//     // const response:AxiosResponse<any> = await axios.get(`https://api.genius.com/search?q=${title}`, {
//     //   headers: {Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`}
//     // })
// const lyric = response.data.syncedLyrics;
// if(!lyric) return res.status(404).json({Error: "No synced lyrics found"});
   
// console.log(`synced lyric: ${lyric}`);
// return res.json({ syncedLyrics: lyric });

//     // const hits = response.data.response.hits;
//     // if(!hits?.length) return res.status(404).json({Error: "No result found"});
    
//     // const path  = hits[0].result.url;
//     // console.log(path);

//     // const page = await axios.get(path);
//     // const $ = cheerio.load(page.data);
//     //   const lyrics = $('[data-lyrics-container="true"]')
//     //   .map((_, el) => $(el).text())
//     //   .get()
//     //   .join("\n");

//     //   console.log(lyrics);
//     //       if (!lyrics) return res.status(404).json({ error: "Backend Lyrics not found" });

  
//     //     return res.json({path, lyrics});

//   }
//   catch(err: any){
//     console.error("Error getting lyric path.");
//     return res.status(400).json({error: "Can't get lyric path"})
//   }
// })

app.get("/getCurrentSyncedLyric", async (_req, res) => {
  try {
    // ✅ Safely parse query parameter
    const contentRaw = _req.query.content as string;
    if (!contentRaw) {
      return res.status(400).json({ error: "Missing 'content' parameter" });
    }

    let content;
    try {
      content = JSON.parse(contentRaw);
    } catch {
      return res.status(400).json({ error: "Invalid JSON in 'content' parameter" });
    }

    const { name, artists, album, duration } = content;

    if (!name || !artists?.length) {
      return res.status(400).json({ error: "Missing song name or artist" });
    }

    // ✅ Properly encoded request to LRCLib API
    const params = new URLSearchParams({
      track_name: name,
      artist_name: artists.join(", "), // LRCLib expects a string, not an array
      album_name: album || "",
      duration: duration?.toString() || ""
    });

    const response: AxiosResponse<any> = await axios.get(`https://lrclib.net/api/get?${params}`);

    const lyric = response.data?.syncedLyrics;

    if (!lyric) {
      console.log("⚠️ No synced lyrics found.");
      return res.status(404).json({ error: "No synced lyrics found" });
    }

    console.log(`✅ Synced lyric received for "${name}"`);
    return res.json({ syncedLyrics: lyric });
  } catch (err: any) {
    console.error("❌ Error fetching synced lyric:", err.message);
    return res.status(500).json({ error: "Internal server error while fetching synced lyric" });
  }
});


app.get("/getCurrentLyric", async (_req, res)=> {
  try{
    const title = _req.query.title;

    if(title)
    console.log(title);
    const response:AxiosResponse<any> = await axios.get(`https://api.genius.com/search?q=${title}`, {
      headers: {Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`}
    })

   
    const hits = response.data.response.hits;
    if(!hits?.length) return res.status(404).json({Error: "No result found"});
    
    const path  = hits[0].result.url;
    console.log(path);

    const page = await axios.get(path);
    const $ = cheerio.load(page.data);
      const lyrics = $('[data-lyrics-container="true"]')
      .map((_, el) => $(el).text())
      .get()
      .join("\n");

          if (!lyrics) return res.status(404).json({ error: "Backend Lyrics not found" });
      console.log(`current lyric ${lyrics}`);

  
        return res.json({path, lyrics});

  }
  catch(err: any){
    console.error("Error getting lyric path.");
    return res.status(400).json({error: "Can't get lyric path"})
  }
})

app.listen(port, ()=> {
    console.log(`"Listening on port ${port}`);
})
