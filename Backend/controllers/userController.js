const User=require('../models/userModel')

const getUserData=async(req,res)=>{
    try{
        // const {userId}=req.body //todo check for the change
        const userId=req.user.id//** after change it worked */
        const user=await User.findById(userId)

        if(!user){
            return res.status(404).json({success:false, message:"User not found"})
        }
         res.status(200).json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified,
            }
         })
    }
    catch(err){
        return res.status(400).json({success:false, message:err.message})
    }
}

module.exports=getUserData