import React, { useState } from 'react';
import { useEffect } from 'react';

interface User_Profile {
  id: string;
  name: string; // map display_name from backend
  pictureUrl: string; // map profileImage from backend
}

function Welcome() {

    const[Profile, setProfile] = useState<User_Profile | null>(null);

    useEffect(()=> {
        const getProfile = async ()=> {
            try{
                const access_token = localStorage.getItem("Access_token");
                const response = await fetch (`http://127.0.0.1:4000/getProfile?AccessToken=${access_token}`);
                const data:User_Profile = await response.json();
                setProfile(data);
                console.log(Profile);

            }catch(err:any){
                console.error(err);
            }
        };
        const timeout = setTimeout(getProfile, 1000);

  // cleanup
  return () => clearTimeout(timeout);
    }, []);

if(!Profile) {return <div>Loading</div>};

  return (
    <div>
        <p>welcome</p>
        <p>{Profile.name}</p>

    </div>
  )
}

export default Welcome