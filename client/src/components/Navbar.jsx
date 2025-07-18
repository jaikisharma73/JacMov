import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useAppContext } from '../context/appContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { favoriteMovies } = useAppContext();

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 py-3'>
      
      {/* Logo */}
      <Link to='/' className='flex-shrink-0'>
        <img src={assets.logo} className='w-40 max-w-full h-auto' />
      </Link>

      {/* Navigation Links */}
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 z-40 flex flex-col md:flex-row items-center max-md:justify-center gap-8 max-md:font-medium max-md:text-lg max-md:w-full max-md:h-screen max-md:bg-black/90 md:bg-white/10 md:border border-gray-300/20 md:rounded-full px-8 py-6 backdrop-blur transition-all duration-300 ${isOpen ? 'max-md:visible' : 'max-md:invisible max-md:w-0 max-md:h-0 overflow-hidden'}`}>
        <XIcon
          className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white'
          onClick={() => setIsOpen(false)}
        />

        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/'>Home</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/movies'>Movies</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/'>Theaters</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/'>Releases</Link>
        {favoriteMovies.length > 0 && (
          <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/favorite'>Favorites</Link>
        )}
      </div>

      {/* Right Section: Search, Login/User, Menu */}
      <div className='flex items-center gap-4'>
        <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer text-white' />

        {!user ? (
          <button
            onClick={openSignIn}
            className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium text-white'
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label='My Bookings'
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate('/my-bookings')}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}

        <MenuIcon
          className='md:hidden w-8 h-8 cursor-pointer text-white'
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
};

export default Navbar;
