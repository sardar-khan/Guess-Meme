import React from 'react'

const CardWrapper = ({ children }) => {
    return (
        <div className='relative mt-2'>
            <div className='absolute top-0 left-0 h-[3px] w-full bg-white'></div>
            <div className='absolute top-0 left-0 h-full w-[3px] bg-white'></div>
            <div className='absolute bottom-[1px] right-[1px] z-10 h-[98%] w-[3px] bg-[#7D73BF]'></div>
            <div className='absolute bottom-0 right-0 w-[99.2%] h-[4px] bg-[#7D73BF]'></div>
            <div className='absolute top-0 right-0 h-[100%] w-[3px] bg-[#353535]'></div>
            <div className='absolute bottom-0 right-0 h-[1px] w-full bg-[#353535]'></div>

            <div className='secondary-bg w-full border-[3px] border-l-[8px] border-t-[8px] border-r-[8px] border-b-[8px] border-[#A49DD2]'>
                <div className='h-full w-full border-[3px] p-[6px] py-3 border-b-[5px] border-r-[5px] border-[#353535] border-b-[#FFFFFF] border-r-[#FFFFFF]'>
                    <div
                        className={`relative bg-white w-full min-h-full border-[3px] border-b-[4px] border-r-[4px] border-[#353535] border-b-[#CBC7E5] border-r-[#CBC7E5] after:absolute after:h-[1px] after:w-full after:top-0 after:left-0 after:bg-[white]`}
                    >
                        <div
                            className={`md:p-[15px] p-[5px] min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}
                            // className={`md:p-[15px] p-[5px] min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardWrapper