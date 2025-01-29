import React, { useEffect } from 'react'
import LaunchCard from './LaunchCard'
import { fetchCoins, selectDeployedCoins } from '../features/coinSlice';
import { useDispatch, useSelector } from 'react-redux';

const Reveal = () => {
    const dispatch = useDispatch();
    const { coins, status, error } = useSelector((state) => state.coins);
    const deployedCoins = useSelector(selectDeployedCoins);

    console.log("RevelPagecoins", coins)
    console.log("RevelPagedeployedCoins", deployedCoins)

    
    useEffect(() => {
        if (status === 'idle') {
            
                                   
            dispatch(fetchCoins({sortBy:'deployed',coinSorting:""}));
        }
    }, [status, dispatch]);

    return (
        <div className='p-2 pt-10 md:p-10'>
            <h2 className=''>Reveal</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                {deployedCoins.map((coin, index) => (
                    <LaunchCard key={index} setSpace="medium" coinData={coin} />
                ))}
            </div>
        </div>
    )
}

export default Reveal