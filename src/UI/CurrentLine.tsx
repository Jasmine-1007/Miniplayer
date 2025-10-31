import React,{useState, useEffect} from 'react';
import { parseLyric } from '../functions/functions';

type CurrentLineProps = {
    syncedlyrics: string;
    progress: number;
}

function CurrentLine ({syncedlyrics, progress}: CurrentLineProps){
    
    if(syncedlyrics ==="") return <div>No lyric yet</div>
    const [currentline, setCurrentLine] = useState("");
    
    const parsed  = parseLyric(syncedlyrics);


    useEffect(()=> {
        const current = parsed.find((line,i)=> {
            const next = parsed[i+1];
            return progress>= line.time && (!next || progress< next.time);
        })
        if(current) setCurrentLine(current.text);
    }, [progress, syncedlyrics]);

    
return (
    <div>{currentline}</div>
);

}
export default CurrentLine