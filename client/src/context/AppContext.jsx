import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [searchedCities, setSearchedCities] = useState([])
  const [showAgencyReg, setShowAgencyReg] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { user } = useUser()
  const { getToken } = useAuth()

  const getProperties = async () => {
    try {
      const {data} = await axios.get('/api/properties')
      if(data.success){
        setProperties(data.properties)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      })
      if (data.success) {
        setIsOwner(data.role === 'agencyOwner')
        setSearchedCities(data.recentSearchedCities)
      } else {
        setTimeout(() => {
          getUser()
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) getUser()
  }, [user])

  useEffect(() => {
    getProperties()
  }, [])

  return (
    <AppContext.Provider
      value={{
        navigate,
        properties,
        setProperties,
        user,
        showAgencyReg,
        setShowAgencyReg,
        isOwner,
        setIsOwner,
        axios,
        getToken,
        searchQuery,
        setSearchQuery,
        searchedCities,
        setSearchedCities
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext)
