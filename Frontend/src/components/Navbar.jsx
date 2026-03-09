import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
    axios.defaults.withCredentials=true
    const navigate=useNavigate()
    const{userData, backendUrl, setUserData, setIsLoggedin}=useContext(AppContext)

    //*! otp verification function
    const sendVerificationOtp=async ()=>{
      try{
        const {data}=await axios.post(`${backendUrl}/api/auth/send-verify-otp`)
        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }
        else{
          toast.error(data.message)
        }
      }
      catch(err){
        toast.error(err.response.data.message)
      }
    }

    const logout=async()=>{
      try{
        axios.defaults.withCredentials=true
        const{data}=await axios.post(`${backendUrl}/api/auth/logout`)
        data.success && setIsLoggedin(false)
        data.success && setUserData(false)
        navigate('/')
      }
      catch(err){
        toast.error(err.response.data.message)
      }
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.Gatekeeper_logo} alt='' className='w-28 sm:w-50'/>

        {userData ? 
         <div style={{
           width: '36px', height: '36px',
           background: 'linear-gradient(135deg, #16a34a, #0ea5e9)',
           boxShadow: '0 2px 14px rgba(14,165,233,0.35)',
           borderRadius: '50%',
           color: 'white',
           fontFamily: 'Syne, sans-serif',
           fontWeight: '700',
           fontSize: '14px',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           position: 'relative',
           cursor: 'default',
         }} className='group'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 pt-10'
              style={{ minWidth: '140px' }}>
              <ul style={{
                background: 'rgba(10, 16, 13, 0.97)',
                border: '1px solid rgba(34,197,94,0.18)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                borderRadius: '10px',
                padding: '6px',
                listStyle: 'none',
                margin: 0,
              }}>
                {!userData.isAccountVerified && 
                 <li onClick={sendVerificationOtp}
                   style={{
                     color: '#4ade80',
                     fontSize: '12px',
                     padding: '7px 12px',
                     borderRadius: '6px',
                     cursor: 'pointer',
                     fontFamily: 'DM Sans, sans-serif',
                   }}
                   className='hover:bg-white/5'>Verify Email</li>
                }
                <li onClick={logout}
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  className='hover:bg-white/5'>Logout</li>
              </ul>
            </div>
         </div>

         :
        
          <button onClick={()=>navigate('/login')}
            style={{
              border: '1px solid rgba(34,197,94,0.35)',
              borderRadius: '20px',
              padding: '8px 22px',
              color: '#4ade80',
              background: 'rgba(34,197,94,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontFamily: 'Syne, sans-serif',
              fontWeight: '600',
              letterSpacing: '0.03em',
              cursor: 'pointer',
            }}>
            Login <img src={assets.arrow_icon}/>
           </button>
        }
    </div>
  )
}

export default Navbar