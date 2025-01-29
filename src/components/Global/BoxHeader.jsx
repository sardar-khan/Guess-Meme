import React from 'react'
import minimize from '../../assets/icons/minimize.png';
import maximize from '../../assets/icons/maximize.png';
import cross from '../../assets/icons/cross.png';
import { Link } from 'react-router-dom';

const BoxHeader = ({label}) => {
    return (
        <div className='flex items-center justify-between gap-1 px-4 py-1 primary-bg'>
            <div className='flex items-center gap-1'>
                <span className='PixelOperatorbold text-white text-[31px] !font-normal pl-2'>{label}</span>
            </div>
            <div className='flex items-center gap-1 cursor-pointer'>
                <img src={minimize} alt="" />
                <img src={maximize} alt="" />
                <Link to='/'><img src={cross} alt="" /></Link>
            </div>
        </div>
    )
}

export default BoxHeader