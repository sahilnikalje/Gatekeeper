//here we will find the token fom the cookie, and from that token we will find the id

const jwt=require('jsonwebtoken')

const userAuth=async(req,res,next)=>{
    const {token}=req.cookies

    if(!token){
        return res.status(401).json({success:false, message:"Not authorized, login again"})
    }

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET)

        //this will chgeck the id and assign it to req.body
        //so that we can get the id and otp 
        if(decoded.id){
            req.user = { id: decoded.id } //changed now
        }
        else{
            return res.status(401).json({success:false, message:"Not authorized, login again"})
        }
        next()
    }
    catch(err){
        res.status(400).json({success:false, message:err.message})
    }
}

module.exports=userAuth