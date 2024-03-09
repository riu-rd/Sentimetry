import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Landing({user}) {
  // Check if user is already authenticated
  const navigate = useNavigate();
  if (user) {
    navigate('/home');
  }

  return (
    <div style={{ backgroundColor: 'rgb(222, 226, 217)' }} className='w-screen h-screen bg-stone-300 flex justify-center items-center'>
            <div className='space-y-28'>
            <div style={{color: 'rgb(190, 145, 43)'}}  className='text-center space-y-3'>
                <h1  className='text-7xl font-extrabold'>SentiMetry</h1>
                <h2 className='linden-hill-regular text-xl'>Navigate Your Inner Landscape, One Entry at a Time</h2>
            </div>

            <div className='mx-auto space-y-1'>
                <Link to="/login"><button style={{backgroundColor: 'rgb(190, 145, 43)'}} className='rounded-3xl mx-auto font-bold m-0 text-white'>Login</button></Link>
                <Link to="/register"><button style={{color: 'rgb(190, 145, 43)'}} className='rounded-3xl mx-auto bg-transparent m-0'>Create an Account</button></Link>
            </div>
        </div>
    </div>
  )
}
