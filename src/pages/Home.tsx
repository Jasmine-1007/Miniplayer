import React, { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';


export default function Home()  {
    
  



    return(

    <div className='flex flex-col content-center items-center flex-wrap'>
      {/* bordered below  */}
        <h2 className='text-white text-3xl font-sans w-fit border-b-2 m-5 mt-15 mb-10 p-3'>Welcome to Miniplayer!</h2>
       
       {/* green button long rounded */}
<a href='http://127.0.0.1:4000/login' className='text-black bg-theme w-50 h-12 rounded-2xl flex content-center items-center justify-center hover:border-black hover:border-2  font-extrabold!'>Log in</a>

<p className='text-white font-sans my-8'>Or <span><a className='text-white font-sans underline hover:text-gray-300!' href='https://www.spotify.com/ca-en/signup'>sign up</a></span> for a new Spotify account</p>
    </div>
    )

}

