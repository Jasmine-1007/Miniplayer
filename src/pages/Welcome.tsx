import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";




function Welcome(props: {className?: string}) {


  const {className} = props;

  const access_token = localStorage.getItem("Access_token");

  const {
    data: profile,
    isPending,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:4000/getProfile?AccessToken=${access_token}`
      );
      const data = await response.json();

      return {
        id: data.id,
        name: data.display_name,
        pictureUrl: data.profileImage,
      };
    },

    enabled: !!access_token,
    staleTime: 0,
    gcTime: 0, // garbage-collect immediately

  });

 


  if (isPending) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="flex-1 flex-col justify-between">
      <div className="flex items-center gap-5 justify-between bg-gray-400/30 p-5 m-0 w-screen top-0 left-0 right-0"> 
        <img src="/Spotify_Logo.svg" className="w-12"></img>
        <div className="flex items-center gap-5">
          {/* <p className="text-lg font-bold">
  {isPending ? "" : (profile?.name || "USER")}
</p> */}
        <p className="text-lg font-bold">{profile.name ? profile.name : "USER"}</p>
        <img src={profile.pictureUrl ?? "/photo/person.jpg"} className="w-13 h-13 rounded-full" width={80}></img></div>
        </div>
    <div className="text-white text-3xl font-sans flex flex-col items-center pt-[2vh]">
      <h2 className={`${className} text-2xl`}>Good to see you, <span className="uppercase">{profile?.name ?? "USER"}</span></h2>
      
     
    </div>
    </div>
  );
}

export default Welcome;
