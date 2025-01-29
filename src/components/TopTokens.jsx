import React from 'react'
import { Link } from 'react-router-dom'

const TopTokens = ({ key, topCoins }) => {
    console.log("topCoinsssssss", topCoins)
    const blockchainType = localStorage.getItem('blockchain')

    return (
        <Link to={`/trade/${topCoins?.tokenDetails?._id}`} className='relative mt-2'>
            <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
            <div className='absolute top-0 left-0 h-full w-[5px] bg-white'></div>
            <div className='absolute bottom-[1px] right-[1px] z-10 h-[98%] w-[8px] bg-[#7D73BF]'></div>
            <div className='absolute bottom-0 right-0 w-[99.2%] h-[5px] bg-[#7D73BF]'></div>
            <div className='absolute top-0 right-0 h-[100%] w-[3px] bg-[#353535]'></div>
            <div className='absolute bottom-0 right-0 h-[1px] w-full bg-[#353535]'></div>

            <div className='secondary-bg h-full w-full border-[3px] border-l-[15px] border-t-[8px] border-r-[15px] border-b-[15px] border-[#A49DD2]'>

                <div className='h-[200px] w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-b-[#FFFFFF] border-r-[#FFFFFF]'>
                    <div className={`flex p-[5px] h-[200px] w-full justify-between gap-1 border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff0] border-r-[#fff0]`}>

                        <div className={`${'w-[150px] h-[full]'}`}>
                            {topCoins?.tokenDetails?.image ?
                                <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${topCoins?.tokenDetails?.image}`} className='w-full' alt="" />
                                :
                                <img src={CardImg} className='w-full h-full' alt="" />
                                // <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.coin?.image}`} className='w-full' alt="" />
                            }
                        </div>

                        <div className={`relative bg-white w-[calc(100%-100px)] sm:w-[calc(100%-150px)] min-h-full border-[3px] border-b-[4px] border-r-[4px] border-[#353535] border-b-[#CBC7E5] border-r-[#CBC7E5] after:absolute after:h-[1px] after:w-full after:top-0 after:left-0 after:bg-[white]`}>
                            <div className={`flex flex-col justify-between p-[5px] md:p-[8px] min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}>
                                <div>
                                    <h5 className='PixelOperatorbold text-[10px] md:text-[14px]'>Created by 💩 <Link to={`/userprofile/${topCoins?.tokenDetails?.creator?._id}`} className='hover:underline'>{topCoins?.tokenDetails?.creator.user_name}</Link></h5>
                                    <h5 className='PixelOperatorbold text-[#D9223E] text-[12px] md:text-[14px]'>Marketcap: {topCoins?.tokenDetails?.market_cap}</h5>
                                    <div className=''>
                                        <div className='flex justify-between items-end w-full mt-[7px] md:mt-[15px]'>
                                            <h5 className='PixelOperatorbold text-[12px] md:text-[15px]'>Progress:</h5>
                                            <h5 className='PixelOperatorbold text-[10px] md:text-[13px]'>{topCoins?.tokenDetails?.bonding_curve_progress || 0}% to {blockchainType === 'SOL' ? 'Radium' : 'Uniswap'}</h5>
                                        </div>

                                        {/* <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1 after:absolute after:bg-[#15C570] after:w-[100px] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]'></div> */}
                                        <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1'>
                                            <div
                                                className='absolute bg-[#15C570] h-full'
                                                style={{ width: `${topCoins?.tokenDetails?.bonding_curve_progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end items-end w-full'>
                                        <h5 className='PixelOperatorbold text-[12px] md:text-[13px] mt-1'>{topCoins?.trust_score}/100</h5>
                                    </div>
                                </div>


                                <div className=''>
                                    <div className='text-black PixelOperator mt-3 capitalize truncate text-[12px] leading-[10px] md:text-[16px] md:leading-[13px] tracking-[-1px]'><strong className='PixelOperatorbold'>{topCoins?.tokenDetails?.name}</strong> (ticker: {topCoins?.tokenDetails?.ticker}): {topCoins?.tokenDetails?.description} </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </Link >
    )
}

export default TopTokens