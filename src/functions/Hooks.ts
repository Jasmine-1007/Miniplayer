import { useQuery } from "@tanstack/react-query";
import { getCurrentSong } from "./functions";
import type { Song } from "./functions";
import { getProgress } from "./functions";
import { getCurrentSyncedLyric } from "./functions";

export function useCurrentSong (token : string | null){
    return useQuery<Song>(
        {
            queryKey: ["currentSong"],
            queryFn: ()=> getCurrentSong(token),
            refetchInterval: 1000,
            enabled: !!token
        }
    )
}


export function useGetProgress (token : string | null, is_playing: boolean | null){
    return useQuery(
        {
            queryKey: ["Progress"],
        queryFn: () => getProgress(token),
        refetchInterval: 900, // refresh every 3 seconds
        enabled: !!token && !!is_playing,
        }
    )
}


export function useGetSyncedLyrics (token : string | null, current : Song | null){
    return useQuery(
        {
            queryKey: ["syncedLyric", current?.name],
        queryFn: () => getCurrentSyncedLyric(current ? JSON.stringify(current) : ""),
        enabled: !!current, 
        }
    )
}