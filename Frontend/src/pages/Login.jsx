import React, { useState, useContext } from 'react'
import axios from 'axios'
import {assets} from "../assets/assets"
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

// Shared style tokens matching Gatekeeper logo palette
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
}

function Login() {
  const navigate=useNavigate()
  const{backendUrl, setIsLoggedin, getUserData}=useContext(AppContext)
  
  const[state, setState]=useState("Signup")
  const[name, setName]=useState("")
  const[email, setEmail]=useState("")
  const[password, setPassword]=useState("")

  const onSubmitHandler=async(e)=>{
    try{
      e.preventDefault()
      axios.defaults.withCredentials=true //*! this will send cookies also with the request

      if(state==='Signup'){ //*!signup
       const {data}=await axios.post(`${backendUrl}/api/auth/register`, {name, email, password})
          if(data.success){ 
           setIsLoggedin(true)
          await getUserData()
           toast.success("Signup successfull")
           navigate('/')
          }
          else{
            toast.error(data.message)
          }
      }
      else{  //*! login
          const {data}=await axios.post(`${backendUrl}/api/auth/login`, {email, password})
          if(data.success){ 
           setIsLoggedin(true)
         await getUserData()
           toast.success("Loggedin successfully")
            navigate('/')
          }
          else{
            toast.error(data.message)
          }
        }
    }
    catch(err){
      toast.error(err.response.data.message)
      console.log(err.response.data.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0'
      style={{ background: GK.bg, position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glow orbs */}
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
      {/* Subtle grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}/>

      <img onClick={()=>navigate('/')}
        src={assets.Gatekeeper_logo} alt=''
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-48 cursor-pointer'/>

      <div style={GK.card} className='p-10 rounded-2xl w-full sm:w-96 text-slate-400 text-sm'>

        <div style={GK.badge}>
          {state === 'Signup' ? 'New Account' : 'Welcome Back'}
        </div>

        <h2 style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
          className='text-3xl font-bold text-white mb-2'>
          {state==='Signup' ? 'Create Account' : 'Login here'}
        </h2>
        <p className='text-slate-500 text-sm mb-8'>
          {state==='Signup' ? 'Create your Account' : 'Login to your account'}
        </p>

        {/*//* form here*/}
        <form onSubmit={onSubmitHandler}>
          {/* //* name here - only on signup */}
          {state==="Signup" && (
            <div style={GK.input} className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl'>
              <img src={assets.person_icon} alt='' style={{ opacity: 0.45, width: '15px' }}/>
              <input
                style={{ background: 'transparent', color: '#e2e8f0' }}
                className='outline-none placeholder-slate-600 w-full text-sm'
                onChange={(e)=>setName(e.target.value)}
                value={name} type="text" placeholder='Full name' required
              />
            </div>
          )}

          {/*//* email here*/}
          <div style={GK.input} className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl'>
            <img src={assets.mail_icon} alt='' style={{ opacity: 0.45, width: '15px' }}/>
            <input
              style={{ background: 'transparent', color: '#e2e8f0' }}
              className='outline-none placeholder-slate-600 text-sm'
              onChange={(e)=>setEmail(e.target.value)}
              value={email} type="email" placeholder='Email address' required
            />
          </div>

          {/*//* password here*/}
          <div style={GK.input} className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-xl'>
            <img src={assets.lock_icon} alt='' style={{ opacity: 0.45, width: '15px' }}/>
            <input
              style={{ background: 'transparent', color: '#e2e8f0' }}
              className='outline-none placeholder-slate-600 text-sm'
              onChange={(e)=>setPassword(e.target.value)}
              value={password} type="password" placeholder='Password' required
            />
          </div>

          {/* // *Forgot password*/}
          <p onClick={()=>navigate('/reset-password')}
            className='mb-6 text-xs cursor-pointer'
            style={{ color: '#22c55e', letterSpacing: '0.01em' }}>Forgot Password?</p>

          {/* // *signup button*/}
          <button type="submit" style={GK.btn} className='w-full py-3 rounded-xl text-white'>
            {state}
          </button>
        </form>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }}/>

        {state==='Signup' ?
          (<p className='text-slate-600 text-center text-xs'>Already have an account?{' '}
            <span onClick={()=>setState('Login')}
              style={{ color: '#22c55e' }} className='cursor-pointer hover:underline'> Login here</span>
          </p>)
          :
          (<p onClick={()=>setState('Signup')}
            className='text-slate-600 text-center text-xs'>Don't have an account?{' '}
            <span style={{ color: '#22c55e' }} className='cursor-pointer hover:underline'> Signup here</span>
          </p>)
        }
      </div>
    </div>
  )
}

export default Login