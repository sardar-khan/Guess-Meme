import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='pb-[70px] justify-center sm:flex sm:justify-between items-center space-x-2 px-3'>
            <div className=''>
                <p className='Inter text-[14px] text-[#616161] text-center'>© guess.meme 2025</p>
            </div>
            <div className='flex justify-center items-center space-x-2 ml-0 sm:!ml-[-130px]'>
               <Link to={'/docs/privacy-policy'}> <p className='Inter text-[14px] text-[#616161] underline'>privacy policy</p></Link>
                <p className='Inter text-[14px] text-[#616161]'>|</p>
              <Link to={'/docs/terms-and-conditions'}>  <p className='Inter text-[14px] text-[#616161] underline'>terms of service</p></Link>
            </div>
            <div></div>
        </div>
    )
}

export default Footer