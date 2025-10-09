import React, { useEffect, useState } from 'react'
import Welcome from "../pages/Welcome";

const Callback = ()=> {

    interface TokenResponse {
  access_token: string;
  refresh_token: string;
  [key: string]: any; // optional, in case Spotify sends extra fields
}

    const [message, setMessage] = useState("");

            const refreshToken = async ()=> {
                try{
                    const RefreshToken = localStorage.getItem("Refresh_token");
                const response = await fetch (`http://127.0.0.1:4000/refresh?refresh_token=${RefreshToken}`);
                const data = await response.json();
                if(data.access_token){
                localStorage.setItem("Access_token", data.access_token);
                console.log("Token Refreshed!");
                }}catch(err:any){
                    console.error(err);
                    setMessage("Error refreshing token.");
                }

            }


    useEffect(()=> {

        const AccessToken = localStorage.getItem("Access_token");
        const RefreshToken = localStorage.getItem("Refresh_token");
  if (AccessToken && RefreshToken) {
    setMessage("Already logged in!");
    refreshToken();
    const interval  = setInterval(refreshToken, 55*60*1000);
    return ()=> {
        clearInterval(interval);
    }
    // Skip fetching a new token
  }

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");


        const fetchToken = async ()=> {
            try {
                const response = await fetch(`http://127.0.0.1:4000/callback?code=${code}`);
                
                const data : TokenResponse & { error?: any }  = await response.json();
                console.log(data);
                      // should print "object"

              
    if (data.error) {
      setMessage(`Error: ${JSON.stringify(data.error)}`);
      return;
    } 

                console.log(`Access token is ${data.access_token}`);
                console.log(`Refresh token is ${data.refresh_token}`);
                localStorage.setItem("Access_token", data.access_token);
                localStorage.setItem("Refresh_token", data.refresh_token);
                setMessage("Login Successful!");

                // refreshToken();
                 const interval = setInterval(refreshToken, 55 * 60 * 1000);
        return () => clearInterval(interval); 


            }
            catch(err:any){
                console.error(err);
                setMessage("An error occured");
            } finally {
      // Clear the URL query string so old code isn't reused
      window.history.replaceState({}, document.title, "/callback");
    }

        }

        fetchToken();
        
        
}, [])

    return(
        <div>
    <div>{message}</div>
    <p>try</p>
    <Welcome />
        </div>);
}

export default Callback;