import React from 'react'
import { assets } from '../assets/assets';
import BlurCircle from './BlurCircle';

const Footer = () => {
  return (
    <footer className="px-6 mt-30 md:px-16 lg:px-24 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <img alt="" className="h-11" src={assets.logo} />
                    <p className="mt-6 text-sm">
                       Welcome to JackMov, your trusted online movie ticket booking plateform designed for every movie lover. JackMov helps you find the perfect movie and book your tickets in second .
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={assets.googlePlay} alt="google play" className="h-9 w-auto " />
                        <img src={assets.appStore} alt="app store" className="h-9 w-auto" />
                    </div>
                </div>
                <BlurCircle left='30px'/>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91 7379185718</p>
                            <p>jack912062sharma@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © JackMov. All Right Reserved.
            </p>
        </footer>
  );
}
export default Footer