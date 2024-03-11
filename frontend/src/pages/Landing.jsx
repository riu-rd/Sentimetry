import React from 'react'
import bgImg from './bg.png'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate()
  return (
    <div style={{ backgroundImage: `url(${bgImg})`}} className='w-screen h-screen bg-stone-300 flex justify-center items-center bg-center bg-no-repeat bg-cover'>
            <div className='space-y-28'>
            <div style={{color: 'rgb(190, 145, 43)'}}  className='text-center space-y-3'>
                <h1  className='text-8xl font-extrabold'>SentiMetry</h1>
                <h2 className='linden-hill-regular text-2xl text-white'>Navigate Your Inner Landscape, One Entry at a Time</h2>
            </div>

            <div className='mx-auto space-y-1'>
            <button className='bg-yellow-600 hover:bg-amber-500 rounded-3xl mx-auto font-bold m-0 p-4 w-1/3 text-2xl'
                    onClick={() => navigate('/login')}>
                Login
            </button>

                <button className='text-white rounded-3xl mx-auto bg-transparent m-0 text-xl hover:underline'
                        onClick={() => navigate('/register')}
                        >Create an Account
                </button>
            </div>
        </div>
    </div>
  )
}
