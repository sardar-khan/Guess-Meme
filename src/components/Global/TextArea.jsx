import React from 'react';

const TextArea = ({ value, onChange, checkRequired }) => {
    return (
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
            <label htmlFor="description" className='formLabel min-w-auto md:min-w-[150px] text-left sm:text-right'>{checkRequired && <>*</>}Description:</label>

            <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                    <textarea
                        id="description"
                        name="description"
                        value={value}
                        onChange={onChange}
                        className='w-full px-2 py-3'
                        rows="5"
                        cols="50"
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default TextArea;
