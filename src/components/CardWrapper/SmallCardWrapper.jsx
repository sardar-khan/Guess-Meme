import React from 'react'

const SmallCardWrapper = ({ children }) => {
    return (
        <div className='relative mt-2'>
            <div className='absolute top-0 left-0 h-[3px] w-full bg-white'></div>
            <div className='absolute top-0 left-0 h-full w-[3px] bg-white'></div>

            <div className='secondary-bg w-full border-[3px] border-l-[5px] border-t-[5px] border-r-[5px] border-b-[5px] border-[#A49DD2]'>
                <div className='h-full'>
                    <div
                        className={`relative bg-white w-full min-h-full border-[3px] border-b-[4px] border-r-[4px] border-[#353535] border-b-[#CBC7E5] border-r-[#CBC7E5] after:absolute after:h-[1px] after:w-full after:top-0 after:left-0 after:bg-[white]`}
                    >
                        <div
                            className={`md:p-[15px] p-[5px] min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SmallCardWrapper