import express from 'express'
import { upload } from '../middleware/multer.js'
import { authUser } from '../middleware/authMiddleware.js'
import { createNewProperty, getAllAvailableProperties, getOwnerProperties, togglePropertyAvailability } from '../controllers/propertyController.js'

const propertyRouter = express.Router()

propertyRouter.post(
  '/',
  authUser,                   // Authenticate first
  upload.array('images', 4),  // Then parse form-data
  createNewProperty
);


propertyRouter.get('/', getAllAvailableProperties)
propertyRouter.get('/owner', getOwnerProperties)
propertyRouter.post('/toggle-availability',authUser,togglePropertyAvailability)

export default propertyRouter