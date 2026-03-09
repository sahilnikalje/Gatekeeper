import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const GK = {
  bg: 'radial-gradient(ellipse at 30% 0%, #0a1f12 0%, #070c0f 50%, #060b14 100%)',
  card: {
    background: 'rgba(10, 16, 13, 0.88)',
    border: '1px solid rgba(34,197,94,0.15)',
    boxShadow: '0 8px 64px rgba(14,165,233,0.10), 0 1.5px 0 rgba(255,255,255,0.03) inset',
    backdropFilter: 'blur(20px)',
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(14,165,233,0.10))',
    border: '1px solid rgba(34,197,94,0.25)',
    borderRadius: '6px',
    padding: '3px 11px',
    fontSize: '10px',
    letterSpacing: '0.14em',
    color: '#4ade80',
    textTransform: 'uppercase',
    marginBottom: '14px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: '700',
  },
  btn: {
    background: 'linear-gradient(135deg, #16a34a, #0ea5e9)',
    boxShadow: '0 4px 24px rgba(14,165,233,0.25)',
    fontFamily: 'Syne, sans-serif',
    letterSpacing: '0.05em',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
  },
  otpInput: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(34,197,94,0.2)',
    color: '#e2e8f0',
    fontFamily: 'Syne, sans-serif',
    fontWeight: '700',
    fontSize: '20px',
    borderRadius: '10px',
    width: '44px',
    height: '52px',
    textAlign: 'center',
    outline: 'none',
  },
}

function EmailVerify() {
  const navigate=useNavigate()
  axios.defaults.withCredentials=true
  const{backendUrl, isLoggedin, userData, getUserData}=useContext(AppContext)
  const inputRefs=useRef([])

  //*! function to move ahead while entering otp
  const handleInput=(e, index)=>{  
     if(e.target.value.length > 0 && index<inputRefs.current.length-1){
       inputRefs.current[index+1].focus()
     }
  }

  //*! function for backspace while entering the otp
  const handleKeyDown=(e,index)=>{ 
     if(e.key==="Backspace" && e.target.value==="" && index>0){
       inputRefs.current[index-1].focus()
     }
  }

  //*! function for copy paste otp
  const handlePaste=(e)=>{ 
    const paste=e.clipboardData.getData('text')
    const pasteArray=paste.split('')
    pasteArray.forEach((char, index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char
      }
    })
  }

  //*! function to submit the otp
  const onSubmitHandler=async(e)=>{
    try{
      e.preventDefault()
      const otpArray=inputRefs.current.map((e)=>e.value)
      const otp=otpArray.join("")

      const {data}=await axios.post(`${backendUrl}/api/auth/verify-account`, {otp})
      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
      }
      else{
        toast.error(data.message)
      }
    }
    catch(err){
      toast.error(err.response.data.message)
    }
  }

  //*! once the account is verified then the user cannot access the mail verify page
  useEffect(()=>{
     isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin, userData])

  return (
    <div className='flex items-center justify-center min-h-screen'
      style={{ background: GK.bg, position: 'relative', overflow: 'hidden' }}>

      {/* Ambient orbs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-60px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}/>

      <img onClick={()=>navigate('/')}
        src={assets.Gatekeeper_logo} alt=''
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-48 cursor-pointer'/>
      
      <form onSubmit={onSubmitHandler} style={GK.card} className='p-10 rounded-2xl w-96 text-sm'>
        <div style={GK.badge}>Email Verification</div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
          className='text-white text-2xl font-bold mb-2'>Verify your email</h1>
        <p className='mb-8 text-sm text-slate-500'>Enter the 6-digit code sent to your email id</p>

        <div onPaste={handlePaste} className='flex justify-between mb-8'>
          {Array(6).fill(0).map((_, index)=>(
            <input
              style={GK.otpInput}
              ref={(e)=>inputRefs.current[index]=e}
              onInput={(e)=>handleInput(e, index)}
              onKeyDown={(e)=>handleKeyDown(e, index)}
              type='text' maxLength='1' key={index} required
            />
          ))}
        </div>
        <button onClick={onSubmitHandler} style={GK.btn} className='w-full py-3 text-white rounded-xl'>
          Verify Email
        </button>
      </form>
    </div>
  )
}

export default EmailVerify