// ConnectButton.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitState } from "@reown/appkit/react";
import { useDisconnect } from '@reown/appkit/react'

import logo from '../assets/logo.png';
import { handleSignUp } from '../utils/api';
import { toast } from 'react-toastify';

const ConnectButton = () => {
    const { address, isConnected } = useAppKitAccount()
    const { disconnect } = useDisconnect()
    const { open, close } = useAppKit() 

    const [connectedAddress, setConnectedAddress] = useState('');

    // console.log("token", localStorage.getItem('token'))
    const blockchain = localStorage.getItem('blockchain')
    // const checkBlockChain = blockchain === 'SOL' ? 'solana' : blockchain === 'ETH' ? 'ethereum' : blockchain === null ? 'solana' : 'solana';
    const checkBlockChain =
        blockchain === 'SOL' ? 'solana' :'bsc';
        
            // blockchain === 'ETH' ? 'ethereum' :
            //     blockchain === 'POL' ? 'polygon' :
            //         blockchain === 'BNB' ? 'bsc' :
            //             blockchain === null ? 'solana' :
            //                 'solana';


    if (checkBlockChain === null) {
        disconnect();
    }
    console.log("signinType", blockchain)


    // Handle the wallet sign-up and authentication
    const handleSignin = useCallback(async () => {
        try {
            if (!isConnected) return toast.error("Wallet address not connected");
            if (!address) return toast.error("Wallet Address is not valid")
            if (isConnected && address) {
                console.log("shaka", isConnected, address, isConnected && address)
                const response = await handleSignUp(address, checkBlockChain);
                console.log("r  ", response)
                if (response?.status === 201 || response?.status === 200) {
                    // toast.success(response.message, { autoClose: 1000 });
                    console.log("Authentication:", response.message);
                }
            }
        } catch (error) {
           await disconnect();
            console.error('Error connecting wallet:', error);
            // toast.error('Failed to connect wallet.', { autoClose: 1000 });
        }
    }, [isConnected, address]);

    // Manage the connection state
    useEffect(() => {
        if (isConnected && address) {
            if (!localStorage.getItem('token')) {
                handleSignin();
            }
        } else {
            localStorage.removeItem('token');
        }
    }, [isConnected, address, handleSignin]);

    const handleConnectClick = () => {
        if (address) {
            open();
        } else {
            open();
        }
    };




    return (
        <div className='themeBtn2 flex items-center cursor-pointer' onClick={handleConnectClick}>
            <span className=''>
                <h2 className='!text-[18px] font-bold PixelOperatorbold'>
                    {address ? (
                        <span className='!text-[18px]'>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                    ) : (
                        'Connect Wallet'
                    )}
                </h2>
            </span>
        </div>



        //     <div className='connectBtn flex items-center w-[190px] cursor-pointer' onClick={handleConnectClick}>
        //     <img src={logo} className='w-[40px] h-[40px]' alt="Logo" />
        //     <h2 className='SegoeUi'>
        //         {address ? (
        //             <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
        //         ) : (
        //             'Connect Wallet'
        //         )}
        //     </h2>
        // </div>


    );
};

export default ConnectButton;



// // ConnectButton.jsx
// import React, { useEffect, useCallback, useState } from 'react';
// import { useAppKit, useAppKitAccount, useAppKitState } from "@reown/appkit/react";
// import { useDisconnect } from '@reown/appkit/react'

// import logo from '../assets/logo.png';
// import { handleSignUp } from '../utils/api';
// import { toast } from 'react-toastify';

// const ConnectButton = () => {
//     const { address, isConnected } = useAppKitAccount()
//     const { disconnect } = useDisconnect()
//     const { open, close } = useAppKit()

//     const [connectedAddress, setConnectedAddress] = useState('');

//     // console.log("token", localStorage.getItem('token'))
//     const blockchain = localStorage.getItem('blockchain')
//     // const checkBlockChain = blockchain === 'SOL' ? 'solana' : blockchain === 'ETH' ? 'ethereum' : blockchain === null ? 'solana' : 'solana';
//     const checkBlockChain =
//         blockchain === 'SOL' ? 'solana' :
//             blockchain === 'ETH' ? 'ethereum' :
//                 blockchain === 'POL' ? 'polygon' :
//                     blockchain === 'BNB' ? 'bsc' :
//                         blockchain === null ? 'solana' :
//                             'solana';


//     if (checkBlockChain === null) {
//         disconnect();
//     }
//     console.log("signinType", blockchain)


//     // Handle the wallet sign-up and authentication
//     const handleSignin = useCallback(async () => {
//         try {
//             if (isConnected && address) {
//                 const response = await handleSignUp(address, checkBlockChain);
//                 if (response?.status === 201 || response?.status === 200) {
//                     // toast.success(response.message, { autoClose: 1000 });
//                     console.log("Authentication:", response.message);
//                 }
//             }
//         } catch (error) {
//             disconnect();
//             console.error('Error connecting wallet:', error);
//             // toast.error('Failed to connect wallet.', { autoClose: 1000 });
//         }
//     }, [isConnected, address, disconnect]);

//     // Manage the connection state
//     useEffect(() => {
//         if (isConnected && address) {
//             if (!localStorage.getItem('token')) {
//                 handleSignin();
//             }
//         } else {
//             localStorage.removeItem('token');
//         }
//     }, [isConnected, address, handleSignin]);

//     const handleConnectClick = () => {
//         if (isConnected) {
//             disconnect();
//         } else {
//             open();
//         }
//     };


//     // const checkBlockChain =
//     // blockchain === 'SOL' ? 'solana' :
//     //     blockchain === 'ETH' ? 'ethereum' :
//     //         blockchain === 'POL' ? 'polygon' :
//     //             blockchain === 'BNB' ? 'bsc' :
//     //                 blockchain === null ? 'solana' :
//     //                     'solana';

//     return (
//         <div className='themeBtn2 flex items-center cursor-pointer' onClick={handleConnectClick}>
//             <span className=''>
//                 <h2 className='!text-[18px] font-bold PixelOperatorbold'>
//                     {address ? (
//                         <span className='!text-[18px]'>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
//                     ) : (
//                         'Connect Wallet'
//                     )}
//                 </h2>
//             </span>
//         </div>
//         //     <div className='connectBtn flex items-center w-[190px] cursor-pointer' onClick={handleConnectClick}>
//         //     <img src={logo} className='w-[40px] h-[40px]' alt="Logo" />
//         //     <h2 className='SegoeUi'>
//         //         {address ? (
//         //             <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
//         //         ) : (
//         //             'Connect Wallet'
//         //         )}
//         //     </h2>
//         // </div>


//     );
// };

// export default ConnectButton;