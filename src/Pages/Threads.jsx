import React, { useEffect, useState } from 'react';
import Arrowback from '../assets/icons/Arrowback.svg';
import { Link, useParams } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom/ChatRoom';
import TradesTable from '../components/Tables/TradesTable';
import HoldersTable from '../components/Tables/HoldersTable';
import { toast } from 'react-toastify';
import { kingoftheHill_progress, Progress_curve_bond, viewCoin } from '../utils/api';
import Progress from '../components/Progress';
import PlaceTrade from '../components/PlaceTrade/PlaceTrade';
import HighchartsReactNew from '../components/Charts/HighchartsReactNew';
import { useNotificationContext } from '../context/NotificationContext';
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import logoSmall from '../assets/icons/logoSmall.png';
import { CiGlobe } from "react-icons/ci";
import { useWalletContext } from '../context/WalletContext';
import PlaceTradeSol from '../components/PlaceTrade/PlaceTradeSol';
import { calculateBondingCurveProgress,calculateKingOfTheHillProgress} from '../components/PlaceTrade/solanaBuySellFunction';


const SocialLinks = ({ coinData }) => {
    console.log("social-links-data",coinData)
    return (
        <div className='flex  gap-2'>
            {coinData?.twitter_link && <a href={coinData?.twitter_link} target="_blank" className="bg-[#8E8DC7]  py-0.5 text-xs md:text-base flex items-center gap-2 justify-center SegoeUi w-full text-center" rel="noreferrer"><FaXTwitter /> twitter</a>}
            {coinData?.telegram_link && <a href={coinData?.telegram_link} target="_blank" className="bg-[#8E8DC7] py-0.5 text-xs md:text-base flex items-center gap-2 justify-center SegoeUi w-full text-center" rel="noreferrer"> <FaTelegramPlane />telegram</a>}
            {coinData?.website && <a href={coinData?.website} target="_blank" className="bg-[#8E8DC7] py-0.5 text-xs md:text-base flex items-center gap-2 justify-center SegoeUi w-full text-center" rel="noreferrer"><CiGlobe /> website </a>}
        </div>
    )

}

const Threads = () => {
    const { id,tokenid} = useParams();
    const [coinData, setCoinData] = useState(null);
    const [kingoftheHill, setKingoftheHill] = useState();
    const [ProgressCurveBond, setProgressCurveBond] = useState();
    const [isDisabled, setIsDisabled] = useState(false);
    const { pusherAfterTrade } = useNotificationContext();
    const [refresh,setRefresh]=useState(false)
    const { block_chain } = useWalletContext()
   
    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                const response = await viewCoin(id);
                setCoinData(response?.data);
                // fetchProgress_curve_bond(response?.data?.token_address);
                // fetchKingoftheHill_progress(response?.data?.token_address);
                fetchProgress_curve_bond(tokenid);
                fetchKingoftheHill_progress(tokenid);
            } catch (error) {
                console.error('Error fetching coin data:', error);
                toast.error('Failed to fetch coin data.');
            }
        };

        fetchCoinData();
    }, [id, ProgressCurveBond,refresh]);


    const fetchKingoftheHill_progress = async (token_address) => {
        try {
            const response = await calculateKingOfTheHillProgress(token_address,true);
            setKingoftheHill(response?.kingOfTheHillProgress);
        } catch (error) {
            console.error('Error kingoftheHill_progress:', error);
          //  toast.error('Failed to kingoftheHill_progress.');
        }
    };

    const fetchProgress_curve_bond = async (token_address) => {
        try {
            const response = await calculateBondingCurveProgress(token_address,true);
          
            setProgressCurveBond(response?.bondingCurveProgress);
        } catch (error) {
            console.error('Error Progress_curve_bond:', error);
          //  toast.error('Failed to Progress_curve_bond.');
        }
    };

   


    const handleCopy = () => {
        navigator.clipboard.writeText(id).then(() => {
            toast.success('Text copied!');

            setIsDisabled(true);
            setTimeout(() => {
                setIsDisabled(false);
            }, 3000);
        }).catch((error) => {
            toast.error('Failed to copy text!');
        });
    };

    console.log("coin-data",coinData)
    return (
        <div className='py-10 px-4 !pb-[100px] md:p-10'>
            <Link to='/' className='flex items-center gap-2 w-fit'>
                <img src={Arrowback} alt="" />
                <span className='Inter text-[#515151] font-normal text-xs'>GO BACK</span>
            </Link>

            <div className='flex justify-between flex-col lg:flex-row gap-3'>
                <div className='w-full lg:w-[70%] mt-5'>
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between mb-[20px]'>
                        <div className='flex items-end gap-[15px] flex-wrap lg:flex-nowrap'>
                            <span className='Inter text-[#515151] font-normal text-xs'>{coinData?.name}</span>
                            <span className='Inter text-[#515151] font-normal text-xs'>Ticker: {coinData?.ticker}</span>
                            {/* <span className='Inter text-[#662286] font-normal text-xs'>Market cap: ${coinData?.market_cap}</span> */}
                            <span className='Inter text-[#662286] font-normal text-xs'>
                                Market cap: ${coinData?.market_cap ? Number(coinData.market_cap).toLocaleString('en-US') : 'N/A'}
                            </span>

                            <div className='flex items-end gap-2'>
                                <span className='Inter text-[#515151] font-normal text-xs'>CA:</span>
                                <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                                    <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>
                                        <input
                                            type="text"
                                            value={coinData?.token_address}
                                            name=""
                                            id=""
                                            className='w-[150px] px-2 py-1 text-xs font-normal'
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <button
                                    className={`themeBtn PixelOperatorbold !text-[10px] font-normal min-w-fit px-2 py-1 z-[0] ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={handleCopy}
                                    disabled={isDisabled}
                                >
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>

                        <div className='Inter flex text-xs items-end text-[#662286] whitespace-nowrap'>
                            created by:
                            <div className='flex items-end gap-1'>
                          {coinData?.creator?.profile_photo ==="https://ibb.co/7zrpRwk"?<img className='w-4 h-4 rounded-md' src={logoSmall} alt="" />: <img className='w-4 h-4 rounded-md' src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.creator?.profile_photo}`} alt="" />}
                                <Link to={`/userprofile/${coinData?.creator?._id}`} className='Inter text-black text-[12px] font-medium p-[2px] rounded-md bg-[#8E8DC7] whitespace-nowrap hover:underline'>{coinData?.creator?.user_name}</Link>
                            </div>
                        </div>
                    </div>
                    {/* <CandlestickComboChart /> */}
                    <HighchartsReactNew />
                    {/* <LightweightCandlestickChart /> */}
                    {/* <AdvancedTradingViewChart symbol="BINANCE:ETHUSDT" /> */}

                    <ChatRoom coinData={coinData} />
                </div>
                <div className='flex flex-col gap-6 w-full lg:w-[30%]'>
                    {
                        block_chain === "SOL" ?
                            (coinData && <PlaceTradeSol refresh={refresh} setRefresh={setRefresh} coinData={coinData} tokenid={tokenid} />)
                            :
                            (coinData && <PlaceTrade coinData={coinData} />)
                    }

                    <SocialLinks coinData={coinData} />
                    <Progress title="Bonding curve progress" progress={ProgressCurveBond} pusherProgress={ProgressCurveBond} />
                    <Progress title="Guess master" progress={kingoftheHill} pusherProgress={kingoftheHill} />
                    <TradesTable />
                    <HoldersTable />

                </div>
            </div>
        </div>
    );
};

export default Threads;
