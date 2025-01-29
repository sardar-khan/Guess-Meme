import React from 'react';
import userprofileImg from '../assets/images/userprofile.png';
import { Link } from 'react-router-dom';
import img from '../assets/images/Group 159.png'


const timeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((now - date) / 1000);

    const minutes = Math.floor(secondsAgo / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
};

const CoinsCreatedCard = ({ coinsCreated, userData }) => {
    console.log("userData", userData);
    console.log("coinsCreated", coinsCreated);

    return (
        <Link to={`/trade/${coinsCreated?._id}`} className='flex flex-col items-center justify-center'>
            <div className='w-[80px] h-[80px] border rounded-full flex object-cover overflow-hidden'>
                <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinsCreated?.image}`} alt="" />
            </div>
            <div className='text-center'>
                <h5 className='PixelOperatorbold text-base flex items-center justify-center gap-2 mt-2'>
                    {/* Created by <img src={userData?.profile_photo} className='w-4 h-4' alt="" /> {userData?.user_name} */}
                    Created by <img src={img} className='w-4 h-4' alt="" /> {userData?.user_name}
                </h5>
                <p className='text-base'>Market cap: ${coinsCreated?.market_cap}</p>
                {/* <div className='flex justify-between items-center w-full mt-2'>
                    <p className='text-sm'>Replies: 669</p>
                    <p className='text-sm'>{timeAgo(coinsCreated?.time)}</p>
                </div> */}
                <h5 className='PixelOperatorbold text-base flex items-center justify-center gap-2 mt-2'>
                    {coinsCreated?.name} (ticker: {coinsCreated?.ticker})
                </h5>
                <p className='text-xs'>{coinsCreated?.description}</p>
            </div>
        </Link>
    );
};

export default CoinsCreatedCard;
