import React, { useState, useContext } from 'react'
import axios from 'axios'
import {assets} from "../assets/assets"
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

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
       const {data}=await axios.post(`${backendUrl}/api/auth/register`, {name, email, password}) //*! destructuring 
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
          const {data}=await axios.post(`${backendUrl}/api/auth/login`, {email, password}) //*! destructuring 
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
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'> 
      <img onClick={()=>navigate('/')}
      src={assets.Gatekeeper_logo} alt='' className='absolute left-5 sm:left-20 top-5 w-28 sm:w-48 cursor-pointer'/>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state==='Signup' ? 'Create Account' : 'Login here'}
        </h2>

        <p className='text-center text-sm mb-6'>
          {state==='Signup' ? 'Create your Account' : "Login to your account"}
        </p>

        {/*//* form here*/}
        <form onSubmit={onSubmitHandler}>
                  {/* //* name here*/}
             {/* //! name input should appear only when we are on signup page */}
               {/* //*signup is coming from state*/}
        {state==="Signup" && (
           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt=''/>
              <input
               className='bg-transparent outline-none text-white placeholder-white w-full'
               onChange={(e)=>setName(e.target.value)}
               value={name}
               type="text"
               placeholder='Enter name'
               required
              />
           </div>
        )}

           {/*//* email here*/}
           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} alt=''/>
              <input
               className='bg-transparent outline-none text-white placeholder-white'
               onChange={(e)=>setEmail(e.target.value)}
               value={email}
               type="email"
               placeholder='Enter email'
               required
              />
           </div>

              {/*//* password here*/}
           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.lock_icon} alt=''/>
              <input
               className='bg-transparent outline-none text-white placeholder-white'
               onChange={(e)=>setPassword(e.target.value)}
               value={password}
               type="password"
               placeholder='Enter password'
               required
              />
           </div>
           {/* // *Forgot password*/}
           <p onClick={()=>navigate('/reset-password')}
           className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

            {/* // *signup button*/}
           <button type="submit" className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>

        {state==='Signup' ? 
        (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?
          <span onClick={()=>setState('Login')}
          className='text-blue-400 cursor-pointer underline'> Login here</span>
        </p>)
        : 
        ( <p onClick={()=>setState('Signup')}
        className='text-gray-400 text-center text-xs mt-4'>Don't have an account?
          <span className='text-blue-400 cursor-pointer underline'> Signup here</span>
        </p>
      )}
      </div>
    </div>
  )
}

export default Login