import React from 'react';
import { Link } from 'react-router-dom';


export default function Home()  {
  return (
    <div>
      {/* bordered below  */}
        <h1 className='text-white'>Welcome to Miniplayer</h1>
       
       {/* green button long rounded */}
<a href="http://127.0.0.1:4000/login" className='!text-white p-3'>Log in</a>

    </div>
  )
}

