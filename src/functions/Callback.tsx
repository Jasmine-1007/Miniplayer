import React, { useEffect, useState } from "react";
import Welcome from "../pages/Welcome";
import { refreshToken } from "./functions";
import { fetchToken } from "./functions";
import CurrentSong from "../UI/CurrentSong";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { TokenResponse } from "./functions";

const Callback = () => {

    //declare windowHeight var
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  //
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  //declare interval to be a timer 
  let interval: NodeJS.Timeout;


  //windowresizing Logic:
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  //refreshToken function moved to function.tsx and imported 
  

  useEffect(() => {

    //check for existent access and refresh token asap as the component renders
    const storedAccessToken = localStorage.getItem("Access_token");
    const storedRefreshToken = localStorage.getItem("Refresh_token");

    //if already logged in (already have tokens)
    if (storedAccessToken && storedRefreshToken) {
        //directly set refreshtoken
      refreshToken();
      //set a 55 minutes timer to refresh token before it expires
      interval = setInterval(refreshToken, 55 * 60 * 1000);
      
    } else {

        //if not logged in, user will be redirected now back to callback with code 
      const params = new URLSearchParams(window.location.search);
      //get the code for each user from the params Spotify sent
      const code = params.get("code");

     //make sure code is not null (as per ts requirement)
      if(code)
      fetchToken(code);
    }
  }, []);

  const Logout = () => {
    // Clear tokens
    localStorage.removeItem("Access_token");
    localStorage.removeItem("Refresh_token");

    // Clear React Query cache
    queryClient.clear();

    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center min-h-0 mt-0">
      <Welcome className={windowHeight < 300 ? "hidden" : ""} />
      <div className="shrink min-h-0 flex items-center">
        <CurrentSong />
      </div>
      <button onClick={Logout}>Log out</button>
    </div>
  );
};

export default Callback;
