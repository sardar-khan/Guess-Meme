import React, { useEffect, useState } from 'react'
import logoSmall from '../../assets/icons/logoSmall.png'
import cmtImg from '../../assets/images/cmtImg.png'
import cmtImg2 from '../../assets/images/cmtImg2.png'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import ReferralModal from '../Modals/ReferralModal'
import { selectCoinById } from '../../features/coinSlice'
import { useSelector } from 'react-redux'
import { Web3ModalProvider } from '../../web3/Web3Provider'
import { useAppKitAccount } from '@reown/appkit/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { checkLikeStatus, toggleLike } from '../../utils/api'
import { useNotificationContext } from '../../context/NotificationContext'
// import { fetchCoins, selectCoinById } from '../../features/coinSlice';

const ChatRoom = ({ coinData }) => {

    const { id } = useParams();
    const [threads, setThreads] = useState(null);
    const [threadID, setThreadID] = useState('');
    const [refferalError, setRefferalError] = useState(null);
    const [error, setError] = useState(null);
    const { isConnected } = useAppKitAccount()
    const [likeStatuses, setLikeStatuses] = useState({}); // To store the like status of each thread

    const [isModalOpen, setIsModalOpen] = useState(false);

    const coin = useSelector((state) => selectCoinById(state, id));
    console.log("trade Coin", coin)

    console.log("coinDatacoinData", coinData)


    const { pusherThread, pusherNotificationThread } = useNotificationContext();
    const hasPusherThread = Object.keys(pusherThread).length > 0;
    const hasPusherNotificationThread = Object.keys(pusherNotificationThread).length > 0;
    // const checkNewPusherTokenStatus = createNotifications?.status;
    console.log("pusherThread", pusherThread)
    console.log("pusherNotificationThread", pusherNotificationThread)


    const fetchLikeStatuses = async () => {
        if (threads?.data) {
            const statuses = {};
            await Promise.all(
                threads?.data?.map(async (item) => {
                    try {
                        const response = await checkLikeStatus(item?._id);
                        console.log("Response Check like Status", response?.liked)
                        statuses[item?._id] = response.liked;
                    } catch (error) {
                        console.error(`Error fetching like status for thread ${item?._id}`, error);
                    }
                })
            );
            setLikeStatuses(statuses);
        }
    };
    useEffect(() => {
        fetchLikeStatuses();
    }, [threads]);

    console.log("likeStatuses", likeStatuses)


    const fetchThreadData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}thread/view/${id}`);
            setThreads(response.data);
            setError(null);
            console.log("fetchThreadData", response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("No trades found for the specified token.");
            } else {
                setError("Error fetching coin data.");
            }
            console.error("Error fetching coin data:", error);
        }
    };


    // const handleLikeStatus = async () => {
    //     try {
    //         const response = await checkLikeStatus('67484296002fa379b41e5b32');
    //         console.log("reponse LikeStatus", response)
    //     } catch (error) {
    //         console.error("Error while LikeStatus:", error);
    //     }
    // };
    useEffect(() => {
        fetchThreadData();
        // handleLikeStatus(); 
    }, [id, threadID, refferalError, isConnected]);



    const handleModalSubmit = (data) => {
        console.log("Comment:", data.comment, "Image:", data.image);
    };
    console.log("threads", threads)

    const handleReplyId = (threadid) => {
        setIsModalOpen(true)
        setThreadID(threadid)
    }

    const openModalReferral = () => {
        if (isConnected) {
            setIsModalOpen(true);
            setThreadID('');
            setRefferalError('')
        }
        else {
            setRefferalError('Connect Wallet First')
        }
    }


    const handletoggleLike = async (thread_id) => {
        try {
            // Get the thread div element
            const likeIcon = document.getElementById(`like-icon-${thread_id}`);

            // Add shake animation class
            likeIcon.classList.add('like-toggle-shake');

            // Remove the animation class after the animation duration (2 seconds)
            setTimeout(() => {
                likeIcon.classList.remove('like-toggle-shake');
            }, 2000);

            // Toggle like status through the API
            const response = await toggleLike(thread_id);
            console.log("response Toggle Like", response);

            // Fetch updated data
            fetchLikeStatuses();
            fetchThreadData();
        } catch (error) {
            console.error("Error while toggling like:", error);
        }
    };




console.log("image",coinData?.creator?.profile_photo,   coinData?.creator?.profile_photo ==="https://ibb.co/7zrpRwk")



    return (
        <>
            <h2>ChatRoom</h2>
            <div className='flex flex-col mt-3'>

                <div className='secondary-bg p-[4px] pb-2 border-b border-[#EEF2FF]'>
                    <div className='flex items-center gap-1'>
                  {coinData?.creator?.profile_photo ==="https://ibb.co/7zrpRwk"?<img className='w-4 h-4 rounded-md' src={logoSmall} alt="img" /> :  <img className='w-4 h-4 rounded-md' src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.creator?.profile_photo}`} alt="" />}
                        <span className='Inter text-black text-[10px] font-medium p-[2px] rounded-md bg-[#8281c9]'>{coinData?.creator?.user_name}</span>
                        <p className='Inter text-black text-[10px] font-medium'>
                            {new Date(coinData?.time).toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}
                        </p>

                    </div>
                    <div className='flex gap-1 mt-2'>
                        {coin?.coin?.image !== null && (
                            <div className='w-full max-w-[150px] flex justify-start items-start'>
                                <img src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`}
                                    //  className='w-full h-full object-cover'
                                    className="w-full max-h-[180px] object-cover "
                                    alt="" />
                            </div>
                        )}
                        <div className="pl-3 w-[calc(100%-128px)]">
                            <h5 className='Inter text-[#121212] text-sm font-bold'>{coinData?.metadata?.name} (ticker: {coinData?.ticker})</h5>
                            <p className='Inter text-sm font-medium'>
                                {coinData?.metadata?.description}
                            </p>
                        </div>
                    </div>
                </div>

                {threads ?
                    <div>
                        {/* Referral */}
                        {/* {threads?.data?.map((item, index) => (
                            <div
                                key={index}
                                id={`like-icon-${item._id}`}
                                className={`color-transition secondary-bg p-[4px] pb-2 border-b border-[#EEF2FF]`}
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${item?.user_id?.profile_photo}`}
                                        alt=""
                                    />
                                    <Link
                                        to={`/userprofile/${item?.user_id?._id}`}
                                        className="Inter text-black text-[10px] font-semibold p-[2px] rounded-md bg-[#8E8DC7] cursor-pointer hover:underline"
                                    >
                                        {item?.user_id?.user_name}
                                    </Link>
                                    <p className="Inter text-[#343434] text-[10px] font-semibold">
                                        {new Date(item?.createdAt).toLocaleString("en-US", {
                                            month: "numeric",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            second: "numeric",
                                            hour12: true,
                                        })}
                                    </p>
                                    <p
                                        className="flex items-center gap-1 Inter text-[#343434] text-[10px] font-semibold cursor-pointer hover:underline"
                                        onClick={() => handletoggleLike(item?._id)}
                                    >
                                        <Icon
                                            icon={`${likeStatuses[item._id] ? "mdi:cards-heart" : "mdi:cards-heart-outline"
                                                }`}
                                            style={{
                                                fontSize: "15px",
                                                color: likeStatuses[item._id] ? "red" : "#343434",
                                            }}
                                        />
                                        <span>{item?.totalLikes}</span>
                                    </p>
                                    <p
                                        className="Inter text-[#343434] text-[10px] font-semibold cursor-pointer hover:underline"
                                        onClick={() => handleReplyId(item?.thread_id)}
                                    >
                                        {item?.thread_id} [reply]
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    {item?.image !== null && item?.image !== "" && (
                                        <div className="w-[128px] h-full max-h-[128px] ">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${item?.image}`}
                                                className="max-h-[128px]"
                                                alt=""
                                            />
                                        </div>
                                    )}

                                    <div className="w-[calc(100%-128px)] pl-2">
                                        <p className="Inter text-sm font-medium text-[#000000]">
                                            <span className="text-[#4225ff] text-base font-extrabold">
                                                {item?.reply_id}
                                            </span>{" "}
                                            {item?.text}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        ))} */}
                        {threads?.data
                            ?.filter((item) =>
                                !hasPusherThread ||
                                !pusherThread?.some(
                                    (pusherThread) =>
                                        pusherThread?.newThread?._id === item?._id
                                )
                            )
                            .map((item, index) => (
                                <div
                                    key={index}
                                    id={`like-icon-${item._id}`}
                                    className={`color-transition secondary-bg p-[4px] pb-2 border-b border-[#EEF2FF]`}
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${item?.user_id?.profile_photo}`}
                                            alt=""
                                        />
                                        <Link
                                            to={`/userprofile/${item?.user_id?._id}`}
                                            className="Inter text-black text-[10px] font-semibold p-[2px] rounded-md bg-[#8E8DC7] cursor-pointer hover:underline"
                                        >
                                            {item?.user_id?.user_name}
                                        </Link>
                                        <p className="Inter text-[#343434] text-[10px] font-semibold">
                                            {new Date(item?.createdAt).toLocaleString("en-US", {
                                                month: "numeric",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric",
                                                hour12: true,
                                            })}
                                        </p>
                                        <p
                                            className="flex items-center gap-1 Inter text-[#343434] text-[10px] font-semibold cursor-pointer hover:underline"
                                            onClick={() => handletoggleLike(item?._id)}
                                        >
                                            <Icon
                                                icon={`${likeStatuses[item._id]
                                                        ? "mdi:cards-heart"
                                                        : "mdi:cards-heart-outline"
                                                    }`}
                                                style={{
                                                    fontSize: "15px",
                                                    color: likeStatuses[item._id] ? "red" : "#343434",
                                                }}
                                            />
                                            <span>{item?.totalLikes}</span>
                                        </p>
                                        <p
                                            className="Inter text-[#343434] text-[10px] font-semibold cursor-pointer hover:underline"
                                            onClick={() => handleReplyId(item?.thread_id)}
                                        >
                                            {item?.thread_id} [reply]
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        {item?.image !== null && item?.image !== "" && (
                                            <div className="w-[128px] h-full max-h-[128px]">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${item?.image}`}
                                                    className="max-h-[128px]"
                                                    alt=""
                                                />
                                            </div>
                                        )}

                                        <div className="w-[calc(100%-128px)] pl-2">
                                            <p className="Inter text-sm font-medium text-[#000000]">
                                                <span className="text-[#4225ff] text-base font-extrabold">
                                                    {item?.reply_id}
                                                </span>{" "}
                                                {item?.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {
                            hasPusherThread &&
                            pusherThread?.map((pusherThread, index) => (
                                <div
                                    key={index}
                                    id={`like-icon-${pusherThread?.newThread?._id}`}
                                    className={`color-transition secondary-bg p-[4px] pb-2 border-b border-[#EEF2FF]`}
                                >
                                    <div className="flex items-center gap-2 ">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${pusherThread?.user_profile}`}
                                            alt=""
                                        />
                                        <Link
                                            to={`/userprofile/${pusherThread?.newThread?._id}`}
                                            className="Inter text-black text-[10px] font-semibold p-[2px] rounded-md bg-[#8E8DC7] cursor-pointer hover:underline"
                                        >
                                            {pusherThread?.user_name}
                                        </Link>
                                        <p className="Inter text-[#343434] text-[10px] font-semibold">
                                            {new Date(pusherThread?.newThread?.createdAt).toLocaleString("en-US", {
                                                month: "numeric",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric",
                                                hour12: true,
                                            })}
                                        </p>
                                        <p
                                            className="flex items-center gap-1 Inter text-[#343434] text-[10px] font-semibold cursor-pointer hover:underline"
                                            onClick={() => handletoggleLike(pusherThread?.newThread?._id)}
                                        >
                                            <Icon
                                                icon={`${likeStatuses[pusherThread?.newThread?._id] ? "mdi:cards-heart" : "mdi:cards-heart-outline"
                                                    }`}
                                                style={{
                                                    fontSize: "15px",
                                                    color: likeStatuses[pusherThread?.newThread?._id] ? "red" : "#343434",
                                                }}
                                            />
                                            {/* <span>{pusherThread?.like.length + 1}</span> */}
                                        </p>
                                        <p
                                            className="Inter text-[#343434] text-[10px] font-semibold cursor-pointer hover:underline"
                                            onClick={() => handleReplyId(pusherThread?.newThread?.thread_id)}
                                        >
                                            {pusherThread?.newThread?.thread_id} [reply]
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        {pusherThread?.newThread?.image !== null && pusherThread?.newThread?.image !== "" && (
                                            <div className="w-[128px] h-full max-h-[128px] ">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${pusherThread?.newThread?.image}`}
                                                    className="max-h-[128px]"
                                                    alt=""
                                                />
                                            </div>
                                        )}

                                        <div className="w-[calc(100%-128px)] pl-2">
                                            <p className="Inter text-sm font-medium text-[#000000]">
                                                <span className="text-[#4225ff] text-base font-extrabold">
                                                    {pusherThread?.newThread?.reply_id}
                                                </span>{" "}
                                                {pusherThread?.newThread?.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    :
                    <div className='SegoeUi text-2xl'>
                        No Referral
                    </div>
                }

                {refferalError && <div className='text-red-600 Inter'>{refferalError}</div>}
                {/* <button
                    onClick={() => { openModalReferral() }}
                    className='themeBtn w-fit px-5 py-4 SegoeUi mt-5'>
                    <span>Referral</span>
                </button> */}

                {/* Referral Modal */}
                <ReferralModal
                    threadID={threadID}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    fetchThreadData={fetchThreadData}
                />


            </div >
        </>
    )
}

export default ChatRoom