import React, { useEffect, useState } from 'react';
import WindowDropdown from './WindowDropdown/WindowDropdown';
import logo from '../assets/logo.png';
import burger from '../assets/icons/burger.png';
import userprofile from '../assets/images/userprofile.png';
import img from '../assets/images/Group 159.png'

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DirectBuy from './DirectBuy';
import ConnectButton from '../web3/ConnectButton';
import { getLatestNotifications } from '../utils/api';
import { useNotificationContext } from '../context/NotificationContext';


const Navbar = () => {
    const blockChain = localStorage.getItem("blockchain")


    const isOn = useSelector((state) => state.animation.isOn);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [latestnotifications, setLatestNotifications] = useState([]);
    const { notifications, createNotifications, notificationsEth, createNotificationsEth } = useNotificationContext();

    //////////////////////// Pusher////////////////////////
    const notificationWithBlockChain = blockChain === "SOL" ? notifications : notificationsEth;
    const createNotificationWithBlockChain = blockChain === "SOL" ? createNotifications : createNotificationsEth;
    console.log("notificationWithBlockChain", notificationWithBlockChain)
    console.log("notificationWithBlockChain", createNotificationWithBlockChain)
    //////////////////////// Pusher////////////////////////

    const triggerAnimation = notifications || createNotifications || notificationsEth || createNotificationsEth !== "" || undefined || null || [] || {}
    console.log("triggerAnimation", triggerAnimation)
    const [isShaking, setIsShaking] = useState(false);
    const handleAnimationEnd = () => {
        setIsShaking(false);
    };



    const formatDate = (dateString) => {
        if (!dateString) return ""; // Handle undefined or null case
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month starts from 0
        const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of year
        return `${day}/${month}/${year}`;
    };


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getLatestNotifications();
                setLatestNotifications(data?.data);
            } catch (err) {
                console.log("Failed to fetch notifications. Please try again later.");
            }
        };

        fetchNotifications();
    }, []);
    console.log("latestnotifications", latestnotifications)


    const hasNotificationData = Object.keys(notificationWithBlockChain).length > 0;
    const hasCreateNotificationData = Object.keys(createNotificationWithBlockChain).length > 0;

    console.log('hasCreateNotificationData', hasNotificationData)
    console.log('hasCreateNotificationData', hasCreateNotificationData)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };


    const openDirectModal = () => {
        setIsModalOpen(true);
        setIsMenuOpen(false)
    };;

    useEffect(() => {
        if (isOn && Object.keys(triggerAnimation).length > 0 && !isShaking) {
            setIsShaking(true);
        }
    }, [isOn, triggerAnimation, isShaking]);

    const animationClass = isShaking ? 'element-to-shake' : '';



    return (
        <div className='px-1 sm:px-2 primary-bg'>
            <div className='flex items-center justify-between px-0 py-2'>
                {/* Logo Section */}
                <div className='flex items-end gap-3'>
                    <Link to='/' className='flex items-center'>
                        <img src={logo} className='w-[40px] sm:w-[30px] mt-[-4px]' alt="Logo" />
                        <h2 className='PixelOperatorbold text-white font-extrabold !text-[28px]'>Guess.Meme</h2>
                    </Link>

                    {/* <div className='flex items-center gap-1'>
                        
                        <div
                            className={`${animationClass} PixelOperatorbold flex items-center gap-1 p-2 text-xs font-semibold rounded bg-white max-[930px]:hidden`}
                            onAnimationEnd={handleAnimationEnd}
                            onAnimationStart={() => setIsShaking(true)}
                        >
                            <img src={!hasNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo}` : notificationWithBlockChain?.coin_photo} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">{!hasNotificationData ? latestnotifications?.latestTrade?.user_name : notificationWithBlockChain?.user_name}</Link>
                            <Link class="hover:underline" href="/">{!hasNotificationData ? latestnotifications?.latestTrade?.action : notificationWithBlockChain?.action}</Link>
                            <img src={!hasNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_name}` : notificationWithBlockChain?.user_name} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>


                        <div
                            className={`${animationClass} PixelOperatorbold flex items-center gap-1 p-2 text-xs font-semibold rounded bg-white max-[930px]:hidden`}
                            onAnimationEnd={handleAnimationEnd} 
                            onAnimationStart={() => setIsShaking(true)} 
                        >
                            <img src={!hasCreateNotificationData || hasCreateNotificationData === undefined ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_profile}` : createNotificationWithBlockChain?.coin_photo} class="w-[12px] h-[12px] rounded-full" alt="" />
                            <Link class="hover:underline" href="/view/undefined">
                                {!hasCreateNotificationData ? latestnotifications?.latestTrade?.user_name : createNotificationWithBlockChain?.user_name}
                            </Link>
                            <Link class="hover:underline" href="/">{!hasCreateNotificationData ? latestnotifications?.latestCoin?.action : createNotificationWithBlockChain?.action}</Link>
                            on {formatDate(!hasCreateNotificationData ? latestnotifications?.latestCoin?.date : createNotificationWithBlockChain?.date)}
                            <img src={!hasCreateNotificationData ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo}` : createNotificationWithBlockChain?.user_name} class="w-[12px] h-[12px] rounded-full" alt="" />
                        </div>

                    </div> */}
                    <div className="flex items-center gap-1">
                        <div
                            className={`${animationClass} PixelOperatorbold flex items-center gap-1 p-2 text-xs font-semibold rounded bg-white max-[930px]:hidden`}
                            onAnimationEnd={handleAnimationEnd}
                            onAnimationStart={() => setIsShaking(true)}
                        >
                            <img
                                src={
                                    !hasNotificationData
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo
                                        }`
                                        : notificationWithBlockChain?.coin_photo
                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                            <Link
                                className="hover:underline truncate max-w-[150px]"
                                href="/view/undefined"
                            >
                                {!hasNotificationData
                                    ? latestnotifications?.latestTrade?.user_name
                                    : notificationWithBlockChain?.user_name}
                            </Link>
                            <Link
                                className="hover:underline truncate max-w-[150px]"
                                href="/"
                            >
                                {!hasNotificationData
                                    ? latestnotifications?.latestTrade?.action
                                    : notificationWithBlockChain?.action}
                            </Link>
                            <img
                                src={
                                    !hasNotificationData
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_name
                                        }`
                                        : notificationWithBlockChain?.user_name
                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                        </div>

                        <div
                            className={`${animationClass} PixelOperatorbold flex items-center gap-1 p-2 text-xs font-semibold rounded bg-white max-[930px]:hidden`}
                            onAnimationEnd={handleAnimationEnd}
                            onAnimationStart={() => setIsShaking(true)}
                        >
                            <img
                                src={
                                    !hasCreateNotificationData || hasCreateNotificationData === undefined
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.user_profile
                                        }`
                                        : createNotificationWithBlockChain?.coin_photo
                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                            <Link
                                className="hover:underline truncate max-w-[150px]"
                                href="/view/undefined"
                            >
                                {!hasCreateNotificationData
                                    ? latestnotifications?.latestTrade?.user_name
                                    : createNotificationWithBlockChain?.user_name}
                            </Link>
                            <Link
                                className="hover:underline truncate max-w-[150px]"
                                href="/"
                            >
                                {!hasCreateNotificationData
                                    ? latestnotifications?.latestCoin?.action
                                    : createNotificationWithBlockChain?.action}
                            </Link>
                            on{" "}
                            <span className="truncate max-w-[150px]">
                                {formatDate(
                                    !hasCreateNotificationData
                                        ? latestnotifications?.latestCoin?.date
                                        : createNotificationWithBlockChain?.date
                                )}
                            </span>
                            <img
                                src={
                                    !hasCreateNotificationData
                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${latestnotifications?.latestCoin?.coin_photo
                                        }`
                                        : createNotificationWithBlockChain?.user_name
                                }
                                className="w-[12px] h-[12px] rounded-full"
                                alt=""
                            />
                        </div>
                    </div>


                </div>

                {/* Hamburger Icon for Mobile */}
                <div className='lg:hidden'>
                    <button
                        className='text-white text-3xl focus:outline-none'
                        onClick={toggleMenu}
                    >
                        <img src={burger} alt="" />
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className='hidden lg:flex gap-2 relative z-[999]'>
                    <WindowDropdown />
                    <Link to='/launchToken' className='themeBtn w-[120px] min-w-[120px] !text-xs uppercase'>
                        <span className='PixelOperatorbold '>Launch Token</span>
                    </Link>
                    {/* <Link to='/editprofile' className='themeBtn w-[35px] min-w-[50px] uppercase'>
                        <span className='mt-[-8px]'>⚡</span>
                    </Link> */}
                    <button
                        className='themeBtn w-[35px] min-w-[50px] uppercase'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className='mt-[-8px]'>⚡</span>
                    </button>


                    <Link to='/howitworks' className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'>
                        <span className='PixelOperatorbold'>?</span>
                    </Link>

                    <ConnectButton />
                </div>
            </div>

            {/* Sidebar Menu for Mobile */}
            <div className={`lg:hidden fixed top-0 left-0 w-[260px] h-full bg-[#1a1a1a] z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className='flex justify-between items-center p-4'>
                    <Link to='/' className='flex items-center' onClick={closeMenu}>
                        <img src={logo} className='w-[30px] mb-[-8px]' alt="Logo" />
                        <h2 className='PixelOperatorbold text-white font-extrabold !text-[22px] mt-[10px]'>Guess.Meme</h2>
                    </Link>
                    <button
                        className='text-white text-3xl focus:outline-none'
                        onClick={toggleMenu}
                    >
                        &times;
                    </button>
                </div>
                <div className='flex flex-col gap-4 p-4'>
                    <WindowDropdown />
                    <Link to='/launchToken' className='themeBtn text-xs uppercase' onClick={closeMenu}>
                        <span className='PixelOperatorbold'>Launch Token</span>
                    </Link>

                    <ConnectButton />
                    <div className='flex gap-2'>
                        <div
                            className='themeBtn w-[35px] min-w-[50px] uppercase'
                            onClick={openDirectModal}
                        >
                            <span className='mt-[-8px]'>⚡</span>
                        </div>
                        <Link onClick={() => setIsMenuOpen(false)} to='/howitworks' className='themeBtn w-[35px] min-w-[50px] text-xl uppercase'>
                            <span className='PixelOperatorbold'>?</span>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Background Overlay when Menu is Open */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed top-0 left-0 w-full h-full bg-black/50 z-40"
                    onClick={closeMenu}
                ></div>
            )}
            <DirectBuy
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Navbar;
