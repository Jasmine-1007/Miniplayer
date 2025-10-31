import React, { useState } from "react";
import { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";


function Welcome() {

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
  });

  if (isPending) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <h2>Welcome to Miniplayer!</h2>
      <p>{profile.name}</p>
      <img src={profile.pictureUrl} width={80}></img>
    </div>
  );
}

export default Welcome;
