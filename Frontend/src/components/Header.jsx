import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const {userData}=useContext(AppContext)
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>

        <div style={{
          position: 'relative',
          marginBottom: '28px',
          display: 'inline-block',
        }}>
          {/* Green-blue glow ring */}
          <div style={{
            position: 'absolute', inset: '-5px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.35), rgba(14,165,233,0.3))',
            filter: 'blur(8px)',
          }}/>
          <img src={assets.header_img} alt='' style={{
            width: '160px', height: '144px',
            borderRadius: '50%',
            position: 'relative',
            border: '2px solid rgba(34,197,94,0.3)',
            objectFit: 'cover',
          }}/>
        </div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.01em' }}
          className='flex items-center gap-2 text-xl sm:text-3xl font-semibold mb-2 '>
            Hey {userData? userData?.name: "Developer" } {/* //todo username should come here*/}
            <img src={assets.hand_wave} alt='' className='w-8 aspect-square'/>
        </h1> 

        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #15803d, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        className='text-3xl sm:text-5xl font-bold mb-4'>Welcome to Gatekeeper</h2>

        <p className='mb-10 max-w-md text-gray-500' style={{ fontSize: '15px', lineHeight: '1.65' }}>
          Let's start with a quick tour and we will have you up and running in no time!
        </p>
        
        <button style={{
          border: '1px solid rgba(34,197,94,0.35)',
          borderRadius: '24px',
          padding: '10px 32px',
          background: 'rgba(34,197,94,0.06)',
          color: '#16a34a',
          fontFamily: 'Syne, sans-serif',
          fontWeight: '600',
          fontSize: '14px',
          letterSpacing: '0.04em',
          cursor: 'pointer',
        }}>Get Started</button>
    </div>
  )
}

export default Header