import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'

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
      const pasteArray=paste.split('')//**this will paste the data by splitting it*/
      pasteArray.forEach((char, index)=>{//**this will paste the data by splitting it*/
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char //** logic to paste the otp at once */
           //*! also one onPaste event will be used in div inside which we have created inputs
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
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate('/')}
        src={assets.Gatekeeper_logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-48 cursor-pointer'/>
      
        <form onSubmit={onSubmitHandler}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
           <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verify OTP</h1>
           <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id</p>

           <div onPaste={handlePaste}
               className='flex justify-between mb-8'> {/*//*! this is the div which has input tags*/}
               {Array(6).fill(0).map((_, index)=>(  //** this will create 6 input fields */
                  <input 
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                  ref={(e)=>inputRefs.current[index]=e}
                  onInput={(e)=>handleInput(e, index)}
                  onKeyDown={(e)=>handleKeyDown(e, index)}
                  type='text'
                  maxLength='1'
                  key={index}
                  required
                 />
               ))}
           </div>
           <button onClick={onSubmitHandler} className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Email</button>
        </form>
    </div>
  )
}
import { AppContext } from '../context/AppContext'

export default EmailVerify