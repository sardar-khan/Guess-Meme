import React, { useEffect, useState } from 'react'
import CardImg from '../assets/images/card 1.png'
import { Link } from 'react-router-dom'
import { calculateBondingCurveProgress } from './PlaceTrade/solanaBuySellFunction'
import { formatNumber } from '../utils/helper'

const LaunchCard = ({ key, setSpace, coinData, topCoins,status }) => {
    console.log("coinDataLaunch", coinData)
    console.log("CoinID", coinData?.coin?._id)
    const [ProgressCurveBond,setProgressCurveBond] = useState()
    const blockchainType = localStorage.getItem('blockchain')
    useEffect(()=>{
       if(coinData?.coin?.token_address) fetchProgress_curve_bond(coinData?.coin?.token_address);
    },[coinData])
    const fetchProgress_curve_bond = async (token_address) => {
        try {
            const response = await calculateBondingCurveProgress(token_address,true);
            console.log('finish her22', response
            );
            setProgressCurveBond(response?.bondingCurveProgress);
        } catch (error) {
            console.error('Error Progress_curve_bond:', error);
          //  toast.error('Failed to Progress_curve_bond.');
        }
    };

    return (
        // <Link to='' className='relative mt-2'>
        <Link to={`/trade/${coinData?.coin?._id}/${coinData?.coin?.token_address}`} className='relative mt-2'>
            <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>
            <div className='absolute top-0 left-0 h-full w-[5px] bg-white'></div>
            <div className='absolute bottom-[1px] right-[1px] z-10 h-[98%] w-[8px] bg-[#7D73BF]'></div>
            <div className='absolute bottom-0 right-0 w-[99.2%] h-[5px] bg-[#7D73BF]'></div>
            <div className='absolute top-0 right-0 h-[100%] w-[3px] bg-[#353535]'></div>
            <div className='absolute bottom-0 right-0 h-[1px] w-full bg-[#353535]'></div>

            <div className='secondary-bg h-full w-full border-[3px] border-l-[15px] border-t-[8px] border-r-[15px] border-b-[15px] border-[#A49DD2]'>

                <div className='h-[200px] w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-b-[#FFFFFF] border-r-[#FFFFFF]'>
                    <div className={`flex p-[5px] h-[200px] w-full justify-between gap-1 border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff0] border-r-[#fff0]`}>

                        <div className="w-full max-w-[150px] h-[180px]  flex justify-start items-start">
                            {coinData?.coin?.image ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.coin?.image}`}
                                    className="w-full max-h-[180px] object-cover "
                                    alt=""
                                />
                            ) : (
                                <img src={CardImg} className="w-full h-full object-cover" alt="" />
                            )}
                        </div>


                        <div className={`relative bg-white w-[calc(100%-100px)] sm:w-[calc(100%-150px)] min-h-full border-[3px] border-b-[4px] border-r-[4px] border-[#353535] border-b-[#CBC7E5] border-r-[#CBC7E5] after:absolute after:h-[1px] after:w-full after:top-0 after:left-0 after:bg-[white]`}>
                            <div className={`flex flex-col justify-between p-[5px] md:p-[8px] min-h-full border-[5px] border-t-[#7D73BF] border-l-[#7D73BF] border-b-[#fff] border-r-[#fff]`}>
                                <div>
                                   {status ==='deployed' && <h5 className='PixelOperatorbold text-[10px] md:text-[14px]'>Created by 💩 <Link to={`/userprofile/${coinData?.coin?.creator?._id}`} className='hover:underline'>{coinData?.coin?.creator?.user_name}</Link></h5>}
                                    <h5 className='PixelOperatorbold text-[#D9223E] text-[12px] md:text-[14px]'>Marketcap: ${formatNumber(coinData?.coin?.market_cap?.toFixed(2))}</h5>
                                    {/* <h5 className='PixelOperatorbold text-[#D9223E] text-[12px] md:text-[14px]'>Marketcap: {coinData?.coin?.market_cap}</h5> */}
                                    <div className=''>
                                        <div className='flex justify-between items-end w-full mt-[7px] md:mt-[15px]'>
                                            <h5 className='PixelOperatorbold text-[12px] md:text-[15px]'>Progress:</h5>
                                            <h5 className='PixelOperatorbold text-[10px] md:text-[13px]'>{ProgressCurveBond || 0}% to {blockchainType === 'SOL' ? 'Raydium' : 'Uniswap'}</h5>
                                        </div>

                                        {/* <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1 after:absolute after:bg-[#15C570] after:w-[100px] after:h-[full] after:bottom-[-5px] after:left-[0px] after:top-[0px]'></div> */}
                                        <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1'>
                                            <div
                                                className='absolute bg-[#15C570] h-full'
                                                style={{ width: `${ProgressCurveBond || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end items-end w-full'>
                                        <h5 className='PixelOperatorbold text-[12px] md:text-[13px] mt-1'>{coinData?.trust_score}/100</h5>
                                    </div>
                                </div>


                                <div className=''>
                                    {/* <div className='flex justify-between w-full mt-[7px] md:mt-[15px]'>
                                        <h5 className='PixelOperatorbold text-[12px] md:text-[15px]'>Trust Score:</h5>
                                    </div>

                                    <div className='relative overflow-hidden bg-[#E9E9E9] h-[10px] mt-1'>
                                        <div
                                            className='absolute bg-[#15C570] h-full'
                                            style={{ width: `${coinData?.trust_score || 0}%` }}
                                        ></div>
                                    </div> */}
                                    <div className='text-black PixelOperator mt-3 capitalize truncate text-[12px] leading-[10px] md:text-[16px] md:leading-[13px] tracking-[-1px]'><strong className='PixelOperatorbold'>{coinData?.status ==='created'?'guess': coinData?.coin?.name}</strong> (ticker: {coinData?.status ==='created'?'?': coinData?.coin?.ticker}): {coinData?.coin?.description} </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </Link >
    )
}

export default LaunchCard