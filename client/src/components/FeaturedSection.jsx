import { ArrowRight } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/appContext';

const FeaturedSection = () => {


const navigate = useNavigate()
const {shows}=useAppContext()


  return (
    <div className='px-6 md:px-16 lg:px-16 xl:px-26 overflow-hidden'>

        <div className='related flex items-center justify-between pt-20 pb-10'>
            <BlurCircle left='1050px' />
            <p className='px-6 md:px-16 lg:px-16 xl:px-4 overflow-hidden'>Now Showing</p>
            <button onClick={()=>navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'>
                View All 
                <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/></button>
        </div>

        <div className='flex flex-wrap max-sm:justify-center gap-3 mt-8'>
            {shows.slice(0,4).map((show)=>(
                <MovieCard key={show._id} movie={show} />
            ))}
        </div>
       

        <div className='flex justify-center mt-20'>
            <button onClick={()=> {navigate('/movies') ; scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show More</button>
        </div>
       
    </div>
  );
}
export default FeaturedSection