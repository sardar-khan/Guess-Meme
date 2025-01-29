import React from 'react'
import { useNotificationContext } from '../context/NotificationContext';

const Progress = ({ title, progress, pusherProgress }) => {


    return (
        <div>
            <div className='flex justify-between items-end w-full mt-[7px] md:mt-[15px]'>
                {/* <h5 className='PixelOperatorbold text-[16px] md:text-[15px]'>Progress:</h5> */}
                <h2 className='mb-[8px] text-[12px] md:!text-[20px]'>{title}: {pusherProgress ? pusherProgress : progress}%</h2>
            </div>

            <div className='relative overflow-hidden bg-[#dbdae4] h-[20px]'>
                <div
                    className='absolute bg-[#15C570] h-full '
                    style={{ width: `${pusherProgress ? parseFloat(pusherProgress) : parseFloat(progress)}%` }}
                ></div>
            </div>
        </div>
    )
}

export default Progress