import React from 'react'

import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/appContext';

const Movies = () => {

  const {shows}=useAppContext()
  return shows.length > 0  ? (
    <div className='relative my-30 mb-60 px-6 md:px-16 lg:px-16 xl:px-18 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="50px" left="0px" />
      <BlurCircle bottom="20px" right="10px" />
      <h1 className='text-lg font-medium my-4'>Now Showing.</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.map((movie)=>(
          <MovieCard movie = {movie} key={movie._id} />
        ))}
      </div>
    </div>
  ):(

    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold text-center'>No movies available</h1>
    </div>
  )
}
export default Movies