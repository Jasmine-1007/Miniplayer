import React, { useEffect, useRef, useState } from "react";
import Welcome from "../pages/Welcome";
import { refreshToken } from "./functions";
import { fetchToken } from "./functions";
import CurrentSong from "../UI/CurrentSong";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenResponse } from "./functions";




const Mainpage = () => {

    //declare windowHeight var
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  
  const queryClient = useQueryClient();


  const navigate = useNavigate();

  //declare interval to be a timer 
  //use useRef so it doesn't rerender each time 
  const intervalRef = useRef<number | null>(null) ;



  let storedAccessToken : string | null;
  let storedRefreshToken : string | null;
//check for existent access and refresh token asap as the component renders
     storedAccessToken = localStorage.getItem("Access_token");
     storedRefreshToken = localStorage.getItem("Refresh_token");

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

    
    //if already logged in (already have tokens)
    if (storedAccessToken && storedRefreshToken) {
        //directly set refreshtoken
      refreshToken(storedRefreshToken);
      //set a 55 minutes timer to refresh token before it expires
      intervalRef.current = setInterval(refreshToken, 55 * 60 * 1000);
      
    }

  

        //at the end clear the interval
        return ()=> {
            if(intervalRef.current) clearInterval(intervalRef.current);
        }


        
}, []);




  const Logout = () => {
    // Clear tokens
    localStorage.removeItem("Access_token");
    localStorage.removeItem("Refresh_token");

    // Clear React Query cache
    queryClient.removeQueries();


    // Redirect to home page
    navigate("/");
  };

  

  return (
    <div className="flex flex-col items-center min-h-0 mt-0">
      <Welcome
       className={windowHeight < 300 ? "hidden" : ""} />
      <div className="shrink min-h-0 flex items-center">
        <CurrentSong token={storedAccessToken} />
      </div>
      <button onClick={Logout}>Log out</button>
    </div>
  );
};

export default Mainpage;
