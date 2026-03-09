import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useState,useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const GK = {
  bg: 'radial-gradient(ellipse at 30% 0%, #0a1f12 0%, #070c0f 50%, #060b14 100%)',
  orbGreen: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
  orbBlue:  'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
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
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
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

function ResetPassword() {

  const{backendUrl}=useContext(AppContext)
  axios.defaults.withCredentials=true

  const navigate=useNavigate()
  const[email, setEmail]=useState('')
  const[newPassword, setNewPassword]=useState('')
  const[isEmailSent, setIsEmailSent]=useState(false)
  const[otp, setOtp]=useState(0)
  const[isOtpSubmitted, setIsOtpSubmitted]=useState(false)

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
      e.preventDefault()
      const paste=e.clipboardData.getData('text')
      const pasteArray=paste.split('')
      pasteArray.forEach((char, index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char
        }
      })
    }

    const onSubmitEmail=async(e)=>{
      e.preventDefault()
      try{
        const{data}=await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
      }
      catch(err){
        toast.error(err.response.data.message)
      }
    }

    const onSubmitOtp=async(e)=>{
      e.preventDefault()
      const otpArray=inputRefs.current.map((e)=>e.value)
      setOtp(otpArray.join(""))
      setIsOtpSubmitted(true)
    }

    const onSubmitNewPassword=async(e)=>{
      e.preventDefault()
      try{
        const{data}=await axios.post(`${backendUrl}/api/auth/reset-password`, {email, otp, newPassword})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && navigate('/login')
      }
      catch(err){
        toast.error(err.response.data.message)
      }
    }

  const PageShell = ({ children }) => (
    <div className='flex items-center justify-center min-h-screen'
      style={{ background: GK.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-100px', right: '-60px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: GK.orbGreen, pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: GK.orbBlue, pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}/>
      <img onClick={()=>navigate('/')}
        src={assets.Gatekeeper_logo} alt=''
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-48 cursor-pointer'/>
      {children}
    </div>
  )

  return (
    <>
      {/*//! form to add the email*/}
      {!isEmailSent &&
        <PageShell>
          <form onSubmit={onSubmitEmail} style={GK.card} className='p-10 rounded-2xl w-96 text-sm'>
            <div style={GK.badge}>Account Recovery</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
              className='text-white text-2xl font-bold mb-2'>Reset Password</h1>
            <p className='mb-8 text-sm text-slate-500'>Enter your registered email address</p>

            <div style={GK.input} className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl'>
              <img className='w-3.5 h-3.5' style={{ opacity: 0.45 }} src={assets.mail_icon}/>
              <input type='email'
                style={{ background: 'transparent', color: '#e2e8f0' }}
                className='outline-none placeholder-slate-600 w-full text-sm'
                onChange={(e)=>setEmail(e.target.value)}
                placeholder='Email address' value={email} required
              />
            </div>
            <button style={GK.btn} className='w-full py-3 text-white rounded-xl mt-2'>Submit</button>
          </form>
        </PageShell>
      }

      {/* //! form to add the otp */}
      {!isOtpSubmitted && isEmailSent &&
        <PageShell>
          <form onSubmit={onSubmitOtp} style={GK.card} className='p-10 rounded-2xl w-96 text-sm'>
            <div style={GK.badge}>Verification</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
              className='text-white text-2xl font-bold mb-2'>Check your email</h1>
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
            <button style={GK.btn} className='w-full py-3 text-white rounded-xl'>Submit</button>
          </form>
        </PageShell>
      }

      {/*//! new password form*/}
      {isOtpSubmitted && isEmailSent &&
        <PageShell>
          <form onSubmit={onSubmitNewPassword} style={GK.card} className='p-10 rounded-2xl w-96 text-sm'>
            <div style={GK.badge}>New Password</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
              className='text-white text-2xl font-bold mb-2'>Set New Password</h1>
            <p className='mb-8 text-sm text-slate-500'>Enter the new password below</p>

            <div style={GK.input} className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl'>
              <img className='w-3.5 h-3.5' style={{ opacity: 0.45 }} src={assets.lock_icon}/>
              <input type='password'
                style={{ background: 'transparent', color: '#e2e8f0' }}
                className='outline-none placeholder-slate-600 w-full text-sm'
                onChange={(e)=>setNewPassword(e.target.value)}
                placeholder='New password' value={newPassword} required
              />
            </div>
            <button style={GK.btn} className='w-full py-3 text-white rounded-xl mt-2'>Submit</button>
          </form>
        </PageShell>
      }
    </>
  )
}

export default ResetPassword