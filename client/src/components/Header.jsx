import React, { useEffect, useState } from 'react'
import { assets } from '../assets/data'
import { Link, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { useClerk, UserButton } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'

const Header = () => {
  const [active, setactive] = useState(false)
  const [menuOpened, setmenuOpened] = useState(false)
  const [showSearch, setshowSearch] = useState(false)
  const location = useLocation()

  const { openSignIn } = useClerk()
  const { navigate, user, isOwner, setShowAgencyReg, searchQuery, setSearchQuery } = useAppContext()

  const BookingIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 36 36'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-scroll-text-icon lucide-scroll-text'
    >
      <path d='M15 12h-5' />
      <path d='M15 8h-5' />
      <path d='M19 17V5a2 2 0 0 0-2-2H4' />
      <path d='M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3' />
    </svg>
  )

  const toggleMenu = () => setmenuOpened(prev => !prev)

  const handleSearchChange = (e)=>{
    setSearchQuery(e.target.value)

    // Redirect to listing page if not already there
    if(e.target.value && location.pathname !== '/listing'){
      navigate('listing')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        setactive(window.scrollY > 10)
      } else {
        setactive(true) // always active on other pages
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [location.pathname])

  return (
    <header className={`${active ? 'bg-white py-3 shadow-md' : 'py-4'} fixed top-0 w-full left-0 right-0 z-50 transition-all duration-200`}>
      <div className='max-padd-container'>
        <div className='flexBetween'>
          {/* Logo */}
          <div className='flex flex-1'>
            <Link to={'/'}>
              <img
                src={assets.logoImg}
                alt="logoImg"
                className={`${!active && "invert"} h-11`}
              />
            </Link>
          </div>

          {/* Navbar */}
          <Navbar
            setmenuOpened={setmenuOpened}
            containerStyles={`${menuOpened
                ? "flex items-start flex-col gap-y-8 fixed top-16 right-6 p-5 bg-white shadow-md w-52 ring-1 ring-slate-900/5 rounded-xl z-50"
                : "hidden lg:flex gap-x-5 xl:gap-x-1 medium-5 p-1"
              } ${!menuOpened && !active ? "text-white" : ""}`}
          />

          {/* Buttons, searchbar & profile */}
          <div className='flex sm:flex-1 items-center sm:justify-end gap-x-4 sm:gap-x-8'>
         
            <div>
               {user && (
        <button
  onClick={() => isOwner ? navigate('/owner') : setShowAgencyReg(true)}
  className={`btn-outline px-2 py-1 text-xs font-semibold 
    ${!active && 'text-primary ring-primary bg-transparent hover:text-black'} bg-secondary/10 hover:bg-white`}
>
  {isOwner ? 'Dashboard' : 'Register Agency'}
</button>


               )}
            </div>

            {/* Searchbar */}
            <div className='relative hidden xl:flex items-center'>
              {/* Search Input */}
              <div
                className={`${active ? "bg-secondary/10" : "bg-white"} transition-all duration-300 ease-in-out ring ring-slate-900/10 rounded-full overflow-hidden ${showSearch
                    ? "w-[266px] opacity-100 px-4 py-2"
                    : "w-11 opacity-0 px-0 py-0"
                  }`}
              >
                <input
                onChange={handleSearchChange}
                value={searchQuery}
                  type="text"
                  placeholder='Type here...'
                  className='w-full text-sm outline-none pr-10 placeholder:text-gray-400'
                />
              </div>

              {/* Search Toggle Button */}

              <div
                onClick={() => setshowSearch(prev => !prev)}
                className={`${active ? "bg-secondary/10" : "bg-primary"} absolute right-0 ring-1 ring-slate-900/10 p-[8px] rounded-full cursor-pointer z-10`}
              >
                <img src={assets.search} alt="searchIcon" />
              </div>
            </div>

            {/* Menu Toggle */}
            <>
              {menuOpened ? (
                <img
                  src={assets.close}
                  alt="closeMenuIcon"
                  onClick={toggleMenu}
                  className={`${!active && "invert"} lg:hidden cursor-pointer text-xl`}
                />
              ) : (
                <img
                  src={assets.menu}
                  alt="openMenuIcon"
                  onClick={toggleMenu}
                  className={`${!active && "invert"} lg:hidden cursor-pointer text-xl`}
                />
              )}
            </>

            {/* User Profile */}
            <div className='group relative top-1'>
              {user ? (
            <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox : {
                  width: '42px',
                  height: '42px'
                }
              }
            }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  label='My Bookings'
                  labelIcon={<BookingIcon />}
                  onClick={()=>navigate('/my-bookings')}
/>
                
              </UserButton.MenuItems>
            </UserButton>  
            
              ) : (
                <button
                  onClick={() => openSignIn()}
                  className='btn-secondary flexCenter gap-2 rounded-full outline-none'
                >
                  Login
                  <img src={assets.user} alt="userIcon" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
