import React, { useEffect, useRef, useState } from "react";
import { refreshToken } from "./functions";
import { fetchToken } from "./functions";
import { replace, useNavigate } from "react-router-dom";

//trial version: callback handles callback only and redirects to main page

//if spotify sends code each time
const HandleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    //check for existent access and refresh token asap as the component renders
    const storedAccessToken = localStorage.getItem("Access_token");
    const storedRefreshToken = localStorage.getItem("Refresh_token");

    //if already logged in (already have tokens)
    if (storedAccessToken && storedRefreshToken) {
      //directly set refreshtoken
      navigate("/main", { replace: true });
    } else {
      //if not logged in, user will be redirected now back to callback with code
      const params = new URLSearchParams(window.location.search);
      //get the code for each user from the params Spotify sent
      const code = params.get("code");

      //make sure code is not null (as per ts requirement)
      if (code) {
        //fetch the tokens with the code and then set an interval to keep refreshing it
        fetchToken(code).then(() => {
          navigate("/main", { replace: true });
        });
      }
      //no need for interval settings
    }
  }, []);

  return <div>Logging in with Spotify...</div>;
};

export default HandleCallback;
