import axios from 'axios';
import { profile } from 'console';
import React, { useState } from 'react';
import { useEffect } from 'react';
import styles from "./Profile.module.css";

function Profile() {

    const [Profile, setProfile] = useState(null);

    useEffect(()=> {
        const token = localStorage.getItem("Access_token");
        if(!token) {
            console.log("Could not find access token.");
            return;
        }
        console.log(token);

        const fetchProfile = async ()=> {
            try{
            const response = await fetch ("https://api.spotify.com/v1/me", {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(await response.json());
        }catch(err:any){
            console.error(err);

        };
        
 
    }
        fetchProfile();
},[]);


  return (
    <div className={styles.profilePage}>
        <p>profile</p>

    </div>
  )
}

export default Profile