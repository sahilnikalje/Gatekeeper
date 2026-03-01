const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const path=require('path')
const User=require('../models/userModel')
const transporter=require('../config/nodemailer')
const {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_EMAIL_TEMPLATE}=require('../config/emailTemplates')

//register
const register=async (req,res)=>{
    const{name, email, password}=req.body
    
    if(!name || !email || !password){
       return res.status(400).json({success:false, message:"All fields are mandetory"})
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
        //   res.cookie('token', token, {
        //     httpOnly:true,
        //     secure: process.env.NODE_ENV==='production', //if env is production then it will work on https
        //                     //if its on development then it will br on http
        //                     //check env
        //     sameSite:process.env.NODE_ENV==='production' ? 'none' : 'strict',
        //     maxAge:7 * 24 * 60 * 60 * 1000
        //   })
               
              //! changed for deployement
                res.cookie('token', token, {
                 httpOnly: true,
                 secure: true,
                 sameSite: 'none',
                 maxAge: 7 * 24 * 60 * 60 * 1000
               })
               
          //after completing the registration user will an email
          const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to Gatekeeper",
            // text:`Welcome to gatekeepet. Your accocunt has been created with email ${email}` //*todo anothr template should come here
            html: WELCOME_EMAIL_TEMPLATE.replace("{{email}}", email),

            attachments:[
                {
                    filename:'Gatekeeper-logo-cropped.png',
                    path:path.join(__dirname, '../public/Gatekeeper-logo-cropped.png'),
                    cid:'logo123'
                }
            ]
          }
       await transporter.sendMail(mailOptions)//this will send an email 
               
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
       return res.status(400).json({success:false, message:"All fields are mandetory"})
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
            //*todo code changed here and in logout also
            // secure: process.env.NODE_ENV==='production', //if env is production then it will work on https
                            //if its on development then it will br on http
                            //check env
            // sameSite:process.env.NODE_ENV==='production' ? 'none' : 'strict',
            secure:true,
            sameSite:'none',
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
            //*todo code changed here & in login cookies also
            // secure: process.env.NODE_ENV==='production',
            // sameSite:process.env.NODE_ENV==='production' ? 'node' : 'strict',
            secure:true,
            sameSite:'none'
        })

        return res.status(200).json({success:true, message:"Loggout successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, message:err.message})
    }
}

//send verification otp to the user
const sendVerifyOtp=async(req,res)=>{
    try{
       const userId = req.user.id//changed now

        
        const user=await User.findById(userId)

        if(user.isAccountVerified){ // check schema 
            return res.status(409).json({success:false, message:"Account already verified"})
        }
        
        //generate otp
      const otp= String(Math.floor(100000 + Math.random()*900000)) //this will generate 6 digit number and by using String we are converting it in a string
      user.verifyOtp=otp//check the schema
      user.verifyOtpExpireAt=Date.now()+ 5 * 60 * 1000 //otp expiry logic
      // Date.now means from todays date till 5 minutes

      await user.save()// these values will be saved here
      //verifyOtp, verifyOtpExpireAt are coming from the schema

      const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Account verification OTP",
            // html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp) .replace("{{email}}", user.email)  //*todo replace it by another template    
            html: EMAIL_VERIFY_TEMPLATE
                 .replace("{{otp}}", otp)
                 .replace("{{email}}", user.email),
            attachments:
            [
                {
                    filename:'Gatekeeper-logo-cropped.png',
                    path:path.join(__dirname, '../public/Gatekeeper-logo-cropped.png'),
                    cid:'logo123'
                }
            ]
        }
        await transporter.sendMail(mailOptions)
        res.status(200).json({success:true, message:"Verification sent on email"})
    }
    catch(err){
        res.status(400).json({success:false, message:err.message})
    }
}


//to verify the email using otp
const verifyEmail=async(req,res)=>{
    const userId = req.user.id //both are changed to debug
    const { otp } = req.body


     if(!userId || !otp){
         return res.status(401).json({success:false, message:"Missing details here"})
     }

    try{
        const user=await User.findById(userId)
        //check if the user is present or not
        if(!user){
            return res.status(404).json({success:false, message:"User not found"})
        }

        //verify the otp
        if(user.verifyOtp==="" || user.verifyOtp!==otp){
            return res.status(403).json({success:false, message:"Invalid otp"})
        }

        // //if the otp is valid then check the expiry date
        if(user.verifyOtpExpireAt < Date.now() ){ //changed to debug
           return res.status(400).json({success:false, message:"Otp expired"})
        }

        user.isAccountVerified=true// this is also coming from schema, initially is was false
        
        //reset again
        user.verifyOtp=''
        user.verifyOtpExpireAt=0
        await user.save()

        return res.status(200).json({success:true, message:"Email verified successfully"})
    }
    catch(err){
       return res.status(401).json({success:false, message:"Missing details"})   
    }
}

//check if the user isauthenticated or not
const isAuthenticated=async(req,res)=>{
    try{
        return res.status(200).json({success:true, message:"User is authenticated"})
    }
    catch(err){
        res.status(401).json({success:false, message:err.message})
    }
}

//send password reset otp

const sendResetOtp=async(req,res)=>{
    const{email}=req.body
    if(!email){
        return res.status(404).json({success:false, message:"Email is required"})
    }

    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({success:false, message:"User not found"})
        }

        //otp generation
        const otp= String(Math.floor(100000 + Math.random()*900000))
        user.resetOtp=otp
        user.resetOtpExpireAt=Date.now()+ 5 * 60 * 1000
        await user.save()

      const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Password reset OTP",
            // html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email) //*todo replaced by another html template
            html: PASSWORD_RESET_TEMPLATE
                  .replace("{{otp}}", otp)
                  .replace("{{email}}", user.email),
            attachments:
            [
                {
                    filename:'Gatekeeper-logo-cropped.png',
                    path:path.join(__dirname, '../public/Gatekeeper-logo-cropped.png'),
                    cid:'logo123'
                }
            ]

        }
        await transporter.sendMail(mailOptions)
        res.status(200).json({success:true, message:"reset otp sent on email"})
    }
    catch(err){
        return res.status(401).json({success:false, message:err.message})
    }
}

//verify otp and reset the password

const resetPassword=async(req,res)=>{
    const{email, otp,newPassword}=req.body
    if(!email || !otp || !newPassword){
        return res.status(400).json({success:false, message:"All fields are mandetory"})
    }
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({success:false, message:"User not found"})
        }

        if(user.resetOtp==="" || user.resetOtp!==otp){
            return res.status(400).json({success:false, message:"Invalid OTP"})
        }
        if(user.resetOtpExpireAt<Date.now()){
            return res.status(400).json({success:false, message:"OTP expired"})
        }

        //encrypt the new password
        const hashedPassword=await bcrypt.hash(newPassword, 10)
        user.password=hashedPassword
        user.resetOtp="" //** reset otp
        user.resetOtpExpireAt=0
        await user.save()//**save new details 

        return res.status(201).json({success:true, message:"Password has been reset successfully"})
    }
    catch(err){
        return res.status(401).json({success:true, message:err.message})
    }
}

module.exports={register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword}