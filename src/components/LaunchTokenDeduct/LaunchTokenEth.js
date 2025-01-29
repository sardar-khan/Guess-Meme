// // handleLaunchToken.js
// import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
// import { useAppKitProvider,useAppKitAccount } from '@reown/appkit/react';
// import { adminSolAddress } from '../../services/config';
// import { toast } from 'react-toastify';
// import { adminTokenAddress } from '../../utils/api';
// import { useBalance, useWriteContract } from 'wagmi';
// import { useSendTransaction,useWaitForTransactionReceipt } from 'wagmi';
// import { parseEther } from 'viem';



// const LaunchTokenEth = () => {
//     const { address, isConnected } = useAppKitAccount()
//     const { data: hash, sendTransaction } = useSendTransaction()
//     // const { isLoading: isConfirming, isSuccess: isConfirmed } =
//     // useWaitForTransactionReceipt({
//     //   hash,
//     // })
//     const result = useBalance({
//         address: address,
//     })
    
//     console.log("user ethereum balanace", result?.data?.formatted);
//     const handleLaunchToken = async () => {
//         try {
//             const adminAddress = await adminTokenAddress();
//             console.log("admin-Address",adminAddress?.ad)
//             if(!adminAddress?.address){return toast.error("somehting went wrong please try again!")}
//             console.log("Initiating Pol transfer...");
//             const userBalance = result?.data?.formatted ? parseFloat(result?.data?.formatted) : 0
//             console.log("userbalane",userBalance);
//             if (userBalance < 0.05) { return toast.error("Insufficent balance in wallet!")}
//             const toAddress = adminAddress?.address;
//             const txResponse = await sendTransaction({toAddress,  value: parseEther("0.05"),})

//            // console.log("transaction hash",txResponse.hash)
            
//         } catch (error) {
//             console.error("Error while transferring eth:", error);
//             toast.error(`Transaction Error: ${error.message}`);
//             return false; // Return failure
//         }
//     };


//     return handleLaunchToken

// };

// export default LaunchTokenEth;



// import { useAppKitAccount } from '@reown/appkit/react';
// import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
// import { parseEther } from 'viem';
// import { toast } from 'react-toastify';
// import { adminTokenAddress } from '../../utils/api';

// const LaunchTokenEth = () => {
//     const { address, isConnected } = useAppKitAccount();
//     const { data: hash, sendTransaction } = useSendTransaction();

//     const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
//         hash: hash,
//     });

    
//     const result = useBalance({
//         address: address,
//     });

//     console.log("user ethereum balance", result?.data?.formatted);

//     const handleLaunchToken = async () => {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 const adminAddress = await adminTokenAddress();
                
//                 if (!adminAddress?.address) {
//                     toast.error("Something went wrong, please try again!");
//                     return reject(new Error("Invalid admin address"));
//                 }

//                 const userBalance = result?.data?.formatted ? parseFloat(result?.data?.formatted) : 0;

//                 if (userBalance < 0.05) {
//                     toast.error("Insufficient balance in wallet!");
//                     return reject(new Error("Insufficient balance"));
//                 }

//                 const toAddress = adminAddress?.address;
//                 const txResponse = await sendTransaction({
//                     to: toAddress,
//                     value: parseEther("0.05"),
//                 });

//                 // Wait for transaction confirmation
//                 const waitForConfirmation = () => {
//                     return new Promise((confirmResolve, confirmReject) => {
//                         const checkConfirmation = () => {
//                             if (isConfirmed) {
//                                 toast.success("Transaction Confirmed!");
//                                 confirmResolve(true);
//                             } else if (!isConfirming) {
//                                 confirmReject(new Error("Transaction failed"));
//                             } else {
//                                 // Continue checking
//                                 setTimeout(checkConfirmation, 1000);
//                             }
//                         };
//                         checkConfirmation();
//                     });
//                 };

//                 const confirmed = await waitForConfirmation();
//                 resolve(confirmed);

//             } catch (error) {
//                 console.error("Error while transferring ETH:", error);
//                 toast.error(`Transaction Error: ${error.message}`);
//                 reject(error);
//             }
//         });
//     };

//     return handleLaunchToken
// };

// export default LaunchTokenEth;


import { useAppKitAccount } from '@reown/appkit/react';
import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-toastify';
import { adminTokenAddress } from '../../utils/api';

const LaunchTokenEth = () => {
    const { address, isConnected } = useAppKitAccount();
    const { data: hash, sendTransaction } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash,
    });

    const result = useBalance({
        address: address,
    });

    const handleLaunchToken = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const adminAddress = await adminTokenAddress();
                
                if (!adminAddress?.address) {
                    toast.error("Something went wrong, please try again!");
                    return reject(new Error("Invalid admin address"));
                }

                const userBalance = result?.data?.formatted ? parseFloat(result?.data?.formatted) : 0;

                if (userBalance < 0.05) {
                    toast.error("Insufficient balance in wallet!");
                    return reject(new Error("Insufficient balance"));
                }

                const toAddress = adminAddress?.address;
                const txResponse = await sendTransaction({
                    to: toAddress,
                    value: parseEther("0.05"),
                });

                // Wait for transaction confirmation
                const waitForConfirmation = () => {
                    return new Promise((confirmResolve, confirmReject) => {
                        const checkConfirmation = () => {
                            if (isConfirmed) {
                                toast.success("Transaction Confirmed!");
                                confirmResolve(true);
                            } else if (!isConfirming) {
                                confirmReject(new Error("Transaction failed"));
                            } else {
                                // Continue checking
                                setTimeout(checkConfirmation, 1000);
                            }
                        };
                        checkConfirmation();
                    });
                };

                const confirmed = await waitForConfirmation();
                resolve(confirmed);

            } catch (error) {
                console.error("Error while transferring ETH:", error);
                toast.error(`Transaction Error: ${error.message}`);
                reject(error);
            }
        });
    };

    return handleLaunchToken;
};

export default LaunchTokenEth;