import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'
import agencyRouter from './routes/agencyRoute.js'
import propertyRouter from './routes/propertyRoute.js'
import bookingRouter from './routes/bookingRoute.js'
import userRouter from './routes/userRoute.js'
import connectCloudinary from './config/cloudinary.js'

await connectDB()
await  connectCloudinary()

const app = express() //Initialize Express application
app.use(cors()) // enables cross-origin resource sharing

// Middleware setup
app.use(express.json()) // enables json request body parsing
app.use(clerkMiddleware())


//API to listen clerk webhooks
app.use('/api/clerk', clerkWebhooks)

// Define API routes
app.use('/api/user', userRouter)
app.use('/api/agencies', agencyRouter)
app.use('/api/properties', propertyRouter)
app.use('/api/bookings', bookingRouter)



// Route endpoint to check api status
app.get('/', (req,res)=>{
    res.send('API CONNECTED SUCCESSFULLY')
})


const port = process.env.PORT || 4000 //Define server port

// start the server
app.listen(port, ()=> console.log(`Server is running at http://localhost:${port}`))