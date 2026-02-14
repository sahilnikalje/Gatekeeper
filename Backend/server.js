const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv').config()
const cookieParser=require('cookie-parser')
const connectDb=require('./config/db')
const authRouter=require('./routes/authRoutes')
const userRouter=require('./routes/userRoutes')

const app=express()

const PORT=process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))


app.get('/', (req,res)=>{
    res.send("Hello there")
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

const startServer=async ()=>{
    try{
        await connectDb()
        app.listen(PORT,()=>{
          console.log(`Server running on Port ${PORT}`)
        })
    }
    catch(err){
        console.log(err.message)
        process.exit(1)
    }
}
startServer()