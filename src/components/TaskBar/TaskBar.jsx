import React, { useState, useEffect } from 'react';
import timeImg from '../../assets/icons/netshell.png';
import dollarbag from '../../assets/icons/dollarbag.png';
import rock from '../../assets/icons/rock.png';
import { NavLink } from 'react-router-dom';
import ConnectButton from '../../web3/ConnectButton';
import { viewUserprofile } from '../../utils/api';
import { useAppKitAccount } from '@reown/appkit/react';

const TaskBar = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userProfileData, setUserProfileData] = useState();
    const { isConnected } = useAppKitAccount()

    const updateTime = () => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }));
    };


    const fetchMainUserProfile = async () => {
        try {
            const viewUserprofileData = await viewUserprofile();

            console.log("viewUserprofileData", viewUserprofileData);
            setUserProfileData(viewUserprofileData?.data);
        } catch (error) {
            console.log("viewUserprofileData error", error);
        }
    };
    useEffect(() => {
        fetchMainUserProfile();
    }, []);


    useEffect(() => {
        console.log("userProfileData has changed:", userProfileData);
    }, [userProfileData]);



    useEffect(() => {
        updateTime();
        const intervalId = setInterval(updateTime, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const navLinkClass = (isActive) =>
        `SegoeUi text-xs overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center gap-2 w-full min-w-[120px] ${isActive ? 'taskActive' : 'taskActiveNot'}`;

    const dropdownClass = (isDropdownOpen) =>
        `ml-2 SegoeUi text-xs overflow-hidden whitespace-nowrap text-ellipsis text-white flex items-center justify-between gap-2 w-full min-w-[120px] ${isDropdownOpen ? 'taskActive' : 'taskActiveNot'
        }`;

    return (
        <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center h-[40px] w-full bg-[#6F48A1] shadow1 z-[1000]'>
            {/* <ConnectButton /> */}

            <div className='relative'>
                <button
                    className={dropdownClass(isDropdownOpen)}
                    onClick={() => { setIsDropdownOpen((prev) => !prev), fetchMainUserProfile() }}
                >
                    Menu <span>▼</span>
                </button>
                {isDropdownOpen && (
                    <div className='ml-2 absolute bottom-full mb-[6px] p-1 left-0 bg-[#6F48A1] text-white rounded shadow-lg'>
                        <div className='flex flex-col gap-1'>
                            <NavLink
                                to='/'
                                className={({ isActive }) => navLinkClass(isActive)}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <img src={dollarbag} alt="Dollar Bag Icon" />
                                Tokens
                            </NavLink>

                            <NavLink
                                to='/launchToken'
                                className={({ isActive }) => navLinkClass(isActive)}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <img src={rock} alt="Rock Icon" />
                                Launch Token
                            </NavLink>

                            <NavLink
                                to='/revealsBestPerformers'
                                className={({ isActive }) => navLinkClass(isActive)}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                👁️ Reveals
                            </NavLink>

                            {isConnected &&
                                <NavLink
                                    to={`/userprofile/${userProfileData?._id}`}
                                    className={({ isActive }) => navLinkClass(isActive)}
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    User profile
                                </NavLink>
                            }
                        </div>
                    </div>
                )}
            </div>

            <div className='h-full flex items-center gap-1 sm:gap-[10px] w-[90px] sm:w-[130px]'>
                <span className='SegoeUi font-normal text-white text-[12px] sm:text-[14px]'>EN</span>
                <div className='timeCls h-full w-full flex justify-center items-center gap-0 sm:gap-1'>
                    <img src={timeImg} className='w-[20px] sm:w-[20px]' alt="Clock Icon" />
                    <span className='SegoeUi font-normal text-white text-[12px] sm:text-[14px]'>{currentTime}</span>
                </div>
            </div>
        </div>
    );
};

export default TaskBar;
