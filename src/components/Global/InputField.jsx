import React, { useState } from 'react';

const InputField = ({
    label,
    placeholder = "",
    value,
    onChange,
    disabled = false,
    type = "text",
    checkRequired
}) => {
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const inputValue = e.target.value;

        if (label === "Username:" && inputValue.length > 15) {
            setError("Username cannot exceed 10 characters");
            return; // Ignore changes that exceed 10 characters
        }

        setError(""); // Clear error if within limit
        onChange(e);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                <label className="formLabel min-w-auto md:min-w-[150px] text-right">
                    {checkRequired && <>*</>}
                    {label}
                </label>

                <div className="h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                    <div className="h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                        <input
                            type={type}
                            value={value}
                            placeholder={placeholder}
                            onChange={handleChange}
                            disabled={disabled}
                            className={`w-full px-2 py-1 ${disabled ? 'bg-gray-200' : ''}`}
                        />
                    </div>
                </div>


            </div>
            {error && <p className="text-[#be2323] text-lg mt-[-25px] text-right">{error}</p>}
        </>
    );
};

export default InputField;



// import React from 'react';

// const InputField = ({ label, placeholder = "", value, onChange, disabled = false, type = "text", checkRequired }) => {
//     const handleChange = (e) => {
//         // If the type is number, prevent negative values
//         if (type === "number" && e.target.value < 0) {
//             return; // Ignore changes that result in negative values
//         }
//         // Call the original onChange handler with the new value
//         onChange(e);
//     };

//     return (
//         <div className='flex flex-col sm:flex-row sm:items-center items-start gap-4'>
//             <label className='formLabel min-w-auto md:min-w-[150px] text-right'>{checkRequired && <>*</>}{label}</label>

//             <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
//                 <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
//                     <input
//                         type={type}
//                         value={value}
//                         placeholder={placeholder}
//                         onChange={handleChange}
//                         disabled={disabled}
//                         className={`w-full px-2 py-1 ${disabled ? 'bg-gray-200' : ''}`}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default InputField;
