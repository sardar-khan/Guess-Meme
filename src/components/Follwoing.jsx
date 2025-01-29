import React from 'react'
import img from '../assets/images/Group 159.png'

const Follwoing = ({ Follwoing, FollwoingLength }) => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='w-[60px] h-[60px] border rounded-full flex justify-center items-center object-cover overflow-hidden'>
                <img src={img} className='' alt="" />
            </div>
            <div className='text-center'>
                <h5 className='PixelOperatorbold text-base flex items-center justify-center mt-1'>Writechsns</h5>
                <p className='text-base'>1 followers</p>
            </div>
        </div>
    )
}

export default Follwoing