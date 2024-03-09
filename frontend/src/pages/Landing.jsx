import React from 'react'

export default function Landing() {
  return (
    <div style={{ backgroundColor: 'rgb(222, 226, 217)' }} className='w-screen h-screen bg-stone-300 flex justify-center items-center'>
            <div className='space-y-28'>
            <div style={{color: 'rgb(190, 145, 43)'}}  className='text-center space-y-3'>
                <h1  className='text-7xl font-extrabold'>SentiMetry</h1>
                <h2 className='linden-hill-regular text-xl'>Navigate Your Inner Landscape, One Entry at a Time</h2>
            </div>

            <div className='mx-auto space-y-1'>
                <button style={{backgroundColor: 'rgb(190, 145, 43)'}} className='rounded-3xl mx-auto font-bold m-0'>Login</button>
                <button style={{color: 'rgb(190, 145, 43)'}} className='rounded-3xl mx-auto bg-transparent m-0'>Create an Account</button>
            </div>
        </div>
    </div>
  )
}
