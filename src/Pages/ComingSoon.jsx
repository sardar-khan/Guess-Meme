import React from 'react'
import minimize from '../assets/icons/minimize.png'
import maximize from '../assets/icons/maximize.png'
import cross from '../assets/icons/cross.png'
import comingSoon from '../assets/images/comingSoon.png'

const ComingSoon = () => {
    return (
        <div className='border flex justify-center items-center py-[55px] px-4 w-full '>

            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>

                <div className='flex items-center justify-between gap-1 px-4 py-1 primary-bg'>
                    <div className='flex items-center gap-1'>
                        <span className='PixelOperator text-white text-[18px] py-2 sm:py-0 sm:text-[31px] !font-normal'>Profile</span>
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <img src={minimize} alt="" />
                        <img src={maximize} alt="" />
                        <img src={cross} alt="" />
                    </div>
                </div>

                <div className='secondary-bg p-[14px]'>

                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='w-full flex flex-col items-center justify-center px-2 py-10 min-h-[320px]'>

                                <img src={comingSoon} alt="" />
                                <button className='themeBtn Inter w-fit'><span>ok</span></button>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ComingSoon