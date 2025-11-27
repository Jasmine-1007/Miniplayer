import React, { useEffect, useState} from 'react'
import Welcome from "../pages/Welcome";
import CurrentSong from '../UI/CurrentSong';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';


const Callback = ()=> {
    

    const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
    const queryClient = useQueryClient();
    
 const navigate = useNavigate();


useEffect(()=> {

    const handleResize = ()=> {
        setWindowHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);
    return ()=> window.removeEventListener("resize", handleResize);
}, [])

    interface TokenResponse {
  access_token: string;
  refresh_token: string;
  [key: string]: any; // optional, in case Spotify sends extra fields
}


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
                }

            }


    useEffect(()=> {

        const storedAccessToken = localStorage.getItem("Access_token");
        const storedRefreshToken = localStorage.getItem("Refresh_token");

            let interval: NodeJS.Timeout;

          if (storedAccessToken && storedRefreshToken) {
    refreshToken();
  interval  = setInterval(refreshToken, 55*60*1000);
    // Skip fetching a new token
  }else{

        const hash = window.location.hash;
        const queryString = hash.split("?")[1];

        const params = new URLSearchParams(queryString);
        const AccessToken = params.get("access_token");
        const RefreshToken = params.get("refresh_token");

        if(AccessToken && RefreshToken){

            
        localStorage.setItem("Access_token", AccessToken);
        localStorage.setItem("Refresh_token", RefreshToken);
        
         interval = setInterval(refreshToken, 55 * 60 * 1000);
         window.history.replaceState({}, document.title, "/callback");
  
        }
    }
      return () => clearInterval(interval);


        
    //Old logic of fetching. delete later

    //     const param = new URLSearchParams(window.location.search);
    //     const code = param.get("code");


    //     const fetchToken = async ()=> {
    //         try {
    //             const response = await fetch(`http://127.0.0.1:4000/callback?code=${code}`);
                
    //             const data : TokenResponse & { error?: any }  = await response.json();
    //             console.log(data);
    //                   // should print "object"

              
    // if (data.error) {
    //   setMessage(`Error: ${JSON.stringify(data.error)}`);
    //   return;
    // } 

    //             console.log(`Access token is ${data.access_token}`);
    //             console.log(`Refresh token is ${data.refresh_token}`);
    //             localStorage.setItem("Access_token", data.access_token);
    //             localStorage.setItem("Refresh_token", data.refresh_token);
    //             setMessage("Login Successful!");

    //             // refreshToken();
    //              const interval = setInterval(refreshToken, 55 * 60 * 1000);
    //     return () => clearInterval(interval); 


    //         }
    //         catch(err:any){
    //             console.error(err);
    //             setMessage("An error occured");
    //         } finally {
    //   // Clear the URL query string so old code isn't reused
    //   window.history.replaceState({}, document.title, "/callback");
    // }

    //     }

    //     fetchToken();
        
        
}, [])


  const Logout = ()=>{
    
  // Clear tokens
  localStorage.removeItem("Access_token");
  localStorage.removeItem("Refresh_token");

  // Clear React Query cache
  queryClient.clear();

  // Redirect to home page
  navigate("/");
}


    return(
        <div className='flex flex-col items-center min-h-0 mt-0'>

 
    <Welcome className={windowHeight < 300 ? "hidden" : ""}/>
    <div className="shrink min-h-0 flex items-center">
    <CurrentSong />
    </div>
    <button onClick={Logout}>Log out</button>
        </div>);
}

export default Callback;