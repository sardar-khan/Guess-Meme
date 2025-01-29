import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrades } from '../../features/tradesSlice';
import logoSmall from '../../assets/icons/logoSmall.png';
import { useNotificationContext } from '../../context/NotificationContext';

const TradesTable = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { trades, loading, error } = useSelector((state) => state.trades);
    console.log("trades", trades)
    const { pusherAfterTrade } = useNotificationContext();
    // latestTrades
console.log("hellos",id)
    useEffect(() => {
        dispatch(fetchTrades(id));
        // }, [dispatch, id]);
    }, []);

    if (loading) return <div className='w-full flex justify-center items-center gap-2'><div className='loader'></div></div>;
    if (error) return <div>No Data Found</div>;

    return (
        <div>
            <h2 className='mb-[8px]'>Trades</h2>

            <table className="min-w-full border-collapse secondary-bg">
                <thead className='Inter text-left text-[#121212] text-sm'>
                    <tr className="border border-[#FFF]">
                        <th className="px-4 py-4">Account</th>
                        <th className="px-4 py-4">Type</th>
                        <th className="px-4 py-4">Date</th>
                    </tr>
                </thead>
                <tbody className='Inter text-left'>
                    {/* {trades.slice(0, 3).map((trade) => ( */}
                    {/* (pusherAfterTrade || trades) */}
                    {(pusherAfterTrade ? pusherAfterTrade?.latestTrades?.data : trades).slice(0, 3).map((trade) => (
                        <tr key={trade._id} className='border border-[#FFF] text-xs'>
                            <td className="px-4 py-4">
                                <Link to={`/userprofile/${trade?.account?._id}`} className='flex items-center gap-1 ml-[-8px]'>
                                    <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${trade?.token_id?.image}`} alt="" className="w-6 h-6 rounded-full" />
                                    <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8E8DC7] hover:underline'>
                                        {trade.account.user_name}
                                    </span>
                                </Link>
                            </td>
                            <td className="px-4 py-4">{trade.type}</td>
                            <td className="px-4 py-4">{new Date(trade.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TradesTable;
