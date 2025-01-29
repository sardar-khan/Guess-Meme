import React from 'react'

const ToggleButton = ({ label }) => {
    return (
        <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
            <label htmlFor="" className='formLabel min-w-auto md:min-w-[150px] text-right'>
                {label.split(" ").map((word, index) => (
                    index === 1 ? (
                        <React.Fragment key={index}>
                            <span>{word}</span>
                            <br />
                        </React.Fragment>
                    ) : (
                        <span key={index}>{word} </span>
                    )
                ))}
            </label>
            <div className='flex items-center gap-4 w-full sm:w-auto'>
                <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                    <span>Yes</span>
                </div>
                <div className='themeBtn Inter w-full min-w-fit sm:min-w-[168px] flex items-center gap-2'>
                    <span>No</span>
                </div>
            </div>
        </div>
    )
}

export default ToggleButton