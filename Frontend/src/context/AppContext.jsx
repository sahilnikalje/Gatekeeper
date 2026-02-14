import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
export const AppContext=createContext()

export const AppContextProvider=({children})=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin]=useState(false)
    const[userData, setUserData]=useState(null)

    const getAuthState=async()=>{
        try{
            const {data}=await axios.get(`${backendUrl}/api/auth/is-auth`)
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    }

    const getUserData=async()=>{ //*! to get the data and display the name 
        try{
            const{data}=await axios.get(`${backendUrl}/api/user/data`)
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }
        catch(err){
            toast.error(err.response.data.message)
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])

    const value={
        backendUrl, 
        isLoggedin, setIsLoggedin, 
        userData, setUserData,
        getUserData
    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}