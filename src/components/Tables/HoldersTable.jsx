import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopHolders, viewCoins } from '../../utils/api';
import copy from '../../assets/icons/copy.png';
import Loader from '../Loader';
import { toast } from 'react-toastify';
import { useNotificationContext } from '../../context/NotificationContext';

const HoldersTable = () => {
    const { id } = useParams();
    const [holders, setHolders] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [coins, setCoins] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [disabledCopy, setDisabledCopy] = useState({});
    const { pusherAfterTrade } = useNotificationContext();

    useEffect(() => {
        const fetchHolders = async () => {
            try {
                const data = await viewCoins('');
                setCoins(data);

                const filteredCoin = data?.data?.find(coin => coin.coin?._id === id);
                console.log("filteredCoinfilteredCoinfilteredCoin", filteredCoin)

                if (filteredCoin) {
                    const tokenAddress = filteredCoin.coin?.token_address;

                    const topholderdata = await getTopHolders(tokenAddress);
                    console.log("getTopHoldersgetTopHolders", topholderdata);
                    setHolders(topholderdata);
                } else {
                    setError("Coin not found");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHolders();
    }, [id]);
    console.log("coinscoinscoinscoins", coins)
    console.log("holders", holders)


    const handleCopy = (address) => {
        navigator.clipboard.writeText(address).then(() => {
            toast.success('Address copied!');
            setDisabledCopy((prev) => ({ ...prev, [address]: true }));

            setTimeout(() => {
                setDisabledCopy((prev) => ({ ...prev, [address]: false }));
            }, 3000);
        }).catch(() => {
            toast.error('Failed to copy address!');
        });
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        // return <div>Error: {error}</div>;
    }
    // if (holders.length === 0) return <div>No Data Found</div>;
    if (holders.length === 0) return <div>No Data Found</div>;


    return (
        <div>
            <h2 className='mb-[8px]'>Holders</h2>
            <table className="min-w-full border-collapse secondary-bg">
                <thead className='Inter text-left text-[#121212] text-sm'>
                    <tr className="border border-[#FFF]">
                        <th className="px-4 py-4">Address</th>
                        <th className="px-4 py-4">Supply</th>
                    </tr>
                </thead>
                <tbody className='Inter text-left'>
                    {(pusherAfterTrade ? pusherAfterTrade?.topHolders?.data : holders).map((holder, index) => (
                        <tr key={index} className='border border-[#FFF] text-xs'>
                            <td className="px-4 py-4">
                                <div className='flex items-center gap-1'>
                                    <span className='Inter text-[#671BBC] text-[12px] font-medium p-[2px] rounded-md'>
                                        {`${holder?.wallet_address?.slice(0, 6)}...${holder?.wallet_address?.slice(-4)}`}
                                    </span>
                                    <img
                                        src={copy}
                                        alt="copy icon"
                                        onClick={() => !disabledCopy[holder?.address] && handleCopy(holder?.address)}
                                        className={`cursor-pointer ${disabledCopy[holder?.address] ? 'opacity-50' : ''}`}
                                        title={disabledCopy[holder?.address] ? 'Please wait...' : 'Copy address'}
                                    />
                                </div>
                            </td>
                            <td className="px-4 py-4">{holder?.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HoldersTable;
