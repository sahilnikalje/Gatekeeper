const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')


//register
const register=async (req,res)=>{
    const{name, email, password}=req.body
    if(!name || !email || !password){
       return res.status().json({success:false, message:"All fields are mandetory"})
    }

    try{
         const existingUser=await User.findOne({email})
         if(existingUser){
            return res.status(409).json({success:false, message:"User already exist"})
         }

         const hashedPassword=await bcrypt.hash(password, 10)

          const user=new User({
             name, 
             email,
             password:hashedPassword
          })
          await user.save()

          const token=jwt.sign(
            {id:user._id, email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
          )
          res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV==='production', //if env is production then it will work on https
                            //if its on development then it will br on http
                            //check env
            sameSite:process.env.NODE_ENV==='production' ? 'none' : 'strict',
            maxAge:7 * 24 * 60 * 60 * 1000
          })

         return res.status(201).json({success:true, message:"registered successfully"})

    }
    catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}

//login
const login=async(req,res)=>{
    const{email, password}=req.body

    if(!email || !password){
       return res.status().json({success:false, message:"All fields are mandetory"})
    }

    try{
        //check mail
        const user=await User.findOne({email})
        if(!user){
           return res.status(403).json({success:false, message:"Invalid email"})
        }

        //check password
        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(403).json({success:false, message:"Invalid password"})
        }

          const token=jwt.sign(
            {id:user._id, email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
          )
          res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV==='production', //if env is production then it will work on https
                            //if its on development then it will br on http
                            //check env
            sameSite:process.env.NODE_ENV==='production' ? 'none' : 'strict',
            maxAge:7 * 24 * 60 * 60 * 1000
          })

          return res.status(200).json({success:true, message:"Loggedin successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, message:err.message})
    }
}

//logout
const logout=async(req,res)=>{
    try{
        res.clearCookie('token', {
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production' ? 'node' : 'strict',
        })

        return res.status(200).json({success:true, message:"Loggout successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, message:err.message})
    }
}

module.exports={register, login, logout}