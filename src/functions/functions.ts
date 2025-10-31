export async function getCurrentSong(token: string | null){
    if(!token) {console.log("No token found.")
        return;
    }

    const response = await fetch (`http://127.0.0.1:4000/getCurrentSong?AccessToken=${token}`)
                const data = await response.json();
                console.log(data);

                return data;
}

export async function getCurrentLyric(title: string){
    if(!title){
        console.log("No title provided.");
        return "No title yet";
    }
    const response = await fetch (`http://127.0.0.1:4000/getCurrentLyric?title=${title}`);
    const data = await response.json();

    if (data.error) return `Error: ${data.error}`;
    return data.lyrics || "No lyrics found";
   

}

export async function getCurrentSyncedLyric(content: string){
    if(!content){
        console.log("No title provided.");
        return "NO title yet";
    }
    const encoded = encodeURIComponent(content);
    const response = await fetch (`http://127.0.0.1:4000/getCurrentSyncedLyric?content=${encoded}`);
    if(!response.ok){
        const err = response.json().catch(()=> null);
        console.log("err", err)
        return err;

    }
    
    const data = await response.json();
    if(!data || Object.keys(data).length === 0) return "Not playing";

    return data || "No synced lyrics found";
   

}

export function parseLyric(syncedLyrics: string){
    const lines = syncedLyrics.split("\n");
    const parsed : {time: number; text: string}[] = [];
    for (const line of lines){
        if(!line) continue;
        const matched =line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
        if(!matched) continue;

        let minutes, seconds, text;
        if(matched[1] && matched[2] &&matched [3]){
        minutes= Number.parseInt(matched[1]);
        seconds = parseFloat(matched[2]);
        text = matched[3].trim() ?? "";
        }
if(minutes!== undefined && seconds!==undefined &&text !==undefined){
        const time = minutes*60 + seconds;
    parsed.push({time, text});
}

        

    }

    return parsed;

}