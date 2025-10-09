import express from "express";
import type {Request, Response} from "express";
import bodyParser from "body-parser";
import axios from "axios";
import type { AxiosResponse } from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { createRoutesFromChildren } from "react-router-dom";


const app = express();
const port = 4000;

let RefreshToken:string;
let AccessToken:string;

const res = dotenv.config({ path: './secrets.env'})

if (!res.parsed) {
  console.log("ERROR: No environment vars found");
  process.exit()
}

const env = res.parsed
console.log(env)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: "http://127.0.0.1:5173"}));

app.get("/login", (_req, res: Response)=> {

    const scope = "user-read-currently-playing%20user-read-playback-state";
    const redirect_url= `https://accounts.spotify.com/authorize?client_id=${
    env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(env.REDIRECT_URI || "")}&scope=${scope}`;

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
        redirect_uri: env.REDIRECT_URI,
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
        res.json({access_token, refresh_token});
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
        client_secret: env.SPOTIFY_CLIENT_SECRET,
      }, headers:{
        "Content-Type": "application/x-www-form-urlencoded",
      },}  );

      const {access_token} = response.data;
      AccessToken = access_token;
      console.log(`refreshed token: ${access_token}`);
      res.json({access_token});

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
              client_id: env.SPOTIFY_CLIENT_ID,
              client_secret: env.SPOTIFY_CLIENT_SECRET,
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




app.listen(port, ()=> {
    console.log(`"Listening on port ${port}`);
})
