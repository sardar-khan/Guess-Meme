import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCoins } from '../features/coinSlice'; // Import fetchCoins action
import folder from '../assets/icons/Group 110.png';
import BoxHeader from '../components/Global/BoxHeader';
import InputField from '../components/Global/InputField';
import TextArea from '../components/Global/TextArea';
import { BuyToken, createCoin, uploadImage } from '../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppKitAccount } from '@reown/appkit/react';
import WalletContext from '../context/WalletContext';
import { useWriteContract } from 'wagmi'



import { useBalance, useSendTransaction, useReadContract, useWaitForTransactionReceipt } from 'wagmi';

import { useNavigate } from 'react-router-dom';
import { GetContractConfiguration } from '../web3/EvmConfig';
import { parseUnits } from 'viem';
import EthCreatorBuyToken from '../components/Modals/EthCreatorBuyTokens';
import { buyTokensEthereum, getPayAbleEtherAmount } from '../components/PlaceTrade/ether-trade-utils';
import { ethers } from 'ethers';
import { fetchTrades } from '../features/tradesSlice';
const LaunchTokens = () => {

    const dispatch = useDispatch();



    const { address, isConnected } = useAppKitAccount();

    const [name, setName] = useState('');
    const [userSolBalnace, setUserSolBalnace] = useState(0);
    const [contractInfo, setContractInfo] = useState('')
    const [preTokenBuy, setPreTokenBuy] = useState(0);
    const [ticker, setTicker] = useState('');
    const [iscreatingCoin, setIsCreatingCoin] = useState(false);
    const [revealTime, setRevealTime] = useState('');
    const [selectedMinutes, setSelectedMinutes] = useState(0); // Default to 0 minutes
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [currentDateTime, setCurrentDateTime] = useState(new Date().toISOString().slice(0, 16));
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10)); // Only the date part
    const [tokenToBuy, setTokenToBuy] = useState(0);
    const [description, setDescription] = useState('');
    const [createdTokenAddress, setCreatedTokenAddress] = useState('')
    const [maxSupply, setMaxSupply] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [toastId, setToastId] = useState(null)
    const [websiteLink, setWebsiteLink] = useState(null)
    const [telegramLink, setTelegramLink] = useState(null)
    const [twitterLink, setTwitterLink] = useState(null)
    const [sortOption, setSortOption] = useState('');
    const { data: balanceData } = useBalance({ address });
    const [isEthToToken, setIsEthToToken] = useState(false)
    const [SelectedAbi, setSelectedAbi] = useState(false)

const[createCoinRes,setCreateCoinRes] = useState(null)
    const navigate = useNavigate();

    const { data: txHash, writeContract } = useWriteContract()
    const { data: buyTxHash, writeContract: useBuyTokens } = useWriteContract()
    const { isLoading: isBuying, isSuccess: isBuyed, data: txData } = useWaitForTransactionReceipt({
        hash: buyTxHash,
    });

    const createCoinresult = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });


    console.log("buy tx data", isBuying, isBuyed, txData)

    const { block_chain } = useContext(WalletContext);


    useEffect(() => {
        console.log("block-chain", block_chain)
        GetContractConfiguration(block_chain).then(async (res) => {
            console.log("block-info", res);
            setContractInfo(res);
        })


    }, [block_chain])

    const checkBlockChain =
        block_chain === 'SOL' ? 'solana' :
            block_chain === 'ETH' ? 'ethereum' :
                block_chain === 'POL' ? 'polygon' :
                    block_chain === 'BNB' ? 'bsc' :
                        block_chain === null ? 'solana' :
                            'solana';




    const [adminAddress, setAdminAddress] = useState('');

    useEffect(() => {
        // const interval = setInterval(() => setCurrentDateTime(new Date().toISOString().slice(0, 16)), 60000);
        const interval = setInterval(() => setCurrentDate(new Date().toISOString().slice(0, 16)), 60000);
        return () => clearInterval(interval);
    }, [adminAddress]);




    const handleImageUpload = async (e) => {
        if (isConnected) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('profile_photo', file);

                try {
                    const data = await uploadImage(formData);
                    setImageUrl(data.imageUrl);
                    toast.success('Image uploaded successfully!');
                } catch (error) {
                    console.error("Error uploading image:", error.message);
                    toast.error(`Error uploading image: ${error.message}`);
                } finally {
                    // Reset file input to allow re-uploading the same file
                    e.target.value = null;
                }
            }
        } else {
            toast.error('Connect Wallet First');
            // Reset file input in case wallet is connected later
            e.target.value = null;
        }
    };


    useEffect(() => {
        if (isConfirmed && txHash) { createEthCoin({ txHash, createCoinresult }) }

    }, [isConfirming, isConfirmed, txHash])

    useEffect(() => {
        if (isBuyed && txData) { buyCreatedCoin({ buyTxHash, txData }) }

    }, [isBuying, isBuyed, txData])

    const createToken = async () => {
        setIsCreatingCoin(true);
        if (!name || !ticker || !imageUrl || !description || !revealTime) {

            toast.error('Please fill in all required fields: Name, Ticker, Image, Description, and Reveal Time.');
            return;
        }

        try {
            const id = toast.loading("Creating Coin...");
            setToastId(id);
            const SelectedAbi = contractInfo.Abi
            const contractAddress = contractInfo.ContractAddress
            const totalSupply = parseUnits('1000000000', 18)
console.log("contratinfo- ",SelectedAbi,contractAddress,totalSupply,name,ticker,totalSupply)

            writeContract({
                address: contractAddress,
                abi: SelectedAbi,
                functionName: 'createToken',
                args: [
                    "0x76399c8A5027fD58A1D1b07500ccC8a223BEE0c3",
                    name,
                    ticker,
                    totalSupply,
                    100
                ],
            })

        } catch (error) {
            setIsCreatingCoin(false)
            toast.update(toastId, { render: "Error while creating coin please try again!", type: "error", isLoading: false, autoClose: 3000 });
            //toast.error('Error creating coin. Please try again.');
            console.error('Error creating coin:', error);
        }
    };

    const handleSubmit = async () => {
        // if (!name || !ticker || !imageUrl || !description || !revealTime) {

        //     toast.error('Please fill in all required fields: Name, Ticker, Image, Description, and Reveal Time.');
        //     return;
        // }
        setIsModalOpen(true);
    }

    const createEthCoin = async ({ txHash, createCoinresult }) => {
        try {

            //  console.log("entering the funtion to create the coin",txHash , createCoinresult)
            const formattedRevealTime = new Date(revealTime).toISOString();
            if (txHash) {


                // Step 2: If the transaction is successful, proceed with creating the coin
                const response = await createCoin({
                    name,
                    ticker,
                    description,
                    image: imageUrl,
                    max_supply: 100,
                    twitter_link: twitterLink ? twitterLink : null,
                    telegram_link: telegramLink ? telegramLink : null,
                    website: websiteLink ? websiteLink : null,
                    bonding_curve: 0,
                    max_buy_percentage: 0,
                    fee: 0,
                    amount: tokenToBuy,
                    timer: formattedRevealTime,
                    hash: txHash,
                    bondingCurve: "",
                    tokenAddress: createCoinresult?.data?.logs[0]?.address
                });
                setCreatedTokenAddress(createCoinresult?.data?.logs[0]?.address)
                if (response.status === 200) {
                    setCreateCoinRes(response.data)
                    if (tokenToBuy && tokenToBuy !== 0) {
                        handleBuyTokens(tokenToBuy, createCoinresult?.data?.logs[0]?.address)
                    } else {
                        if(toastId) { toast.update(toastId, {
                            render: "Coin created successfully!",
                            type: "success",
                            isLoading: false,
                            autoClose: 3000, // Auto dismiss after 3 seconds
                          });}
                        setIsCreatingCoin(false);
                        toast.success(response.message);
                        resetForm();
                        navigate('/');
                        dispatch(fetchCoins({ sortBy: sortOption, coinSorting: "" }));
                    }

                } else {
                    //toast.error('Failed to create coin. Please try again.');
                    setIsCreatingCoin(false);
                    if (toastId) {toastId, toast.update(id, { render: "Failed to save coin", type: "error", isLoading: false, autoClose: 3000 }); }

                }
            }
        } catch (error) {
            console.log("error while creating token", error)
            setIsCreatingCoin(false);
            if (toastId) { toast.update(toastId, { render: "Failed to save coin", type: "error", isLoading: false, autoClose: 3000 }); }

        }
    }

    const resetForm = () => {
        setName('');
        setTicker('');
        setDescription('');
        setMaxSupply('');
        setRevealTime('');
        setImageFile(null);
        setImageUrl('');
        setFileName('');
    };


    const handleTimeSelect = (minutes) => {
        setSelectedMinutes(minutes);

        const currentTime = new Date();

        currentTime.setMinutes(currentTime.getMinutes() + minutes);

        currentTime.setHours(currentTime.getHours());

        const formattedTime = currentTime.toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        setRevealTime(formattedTime);
    };


    const handleBuyTokens = async (amount, tokenAddress) => {
        try {

            setPreTokenBuy(amount)
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);
            const payAbleAmountEther = await getPayAbleEtherAmount(tokenAddress, amount, balanceData?.formatted)
            console.log("get-balance", payAbleAmountEther?.data)
            const SelectedAbi = contractInfo.Abi
            const contractAddress = contractInfo.ContractAddress

            const payAmount = payAbleAmountEther?.data
            if (toastId) toast.update(toastId, {
                render: "Buying Coin...",
                isLoading: true,
            });

            useBuyTokens({
                address: contractAddress,
                abi: SelectedAbi,
                functionName: 'buyTokens',
                args: [
                    tokenAddress,
                    formattedAmount,
                ],
                value: payAmount

            })

        } catch (error) {
            console.log("error while buying tokens", error)
            setIsCreatingCoin(false);
            if (toastId) { toast.update(toastId, { render: "Failed to buy Tokens", type: "error", isLoading: false, autoClose: 3000 }); }

        }
    }

    const calculateRevealTime = (date, minutes) => {
        const baseDate = new Date(date);
        const revealTime = new Date(baseDate.getTime() + minutes * 60 * 1000);
        return revealTime.toISOString().replace("T", " ").slice(0, 16); // Format: "YYYY-MM-DD HH:MM"
    };

    const txsss = {
        blockHash: "0x5f2790bd78bec2b76738bb749786afc83657aa4bdb84bba10fd6290f11ffeb09",
        blockNumber: 47802833n,
        chainId: 97,
        contractAddress: null,
        cumulativeGasUsed: 265061n,
        effectiveGasPrice: 3000000000n,
        from: "0x76399c8a5027fd58a1d1b07500ccc8a223bee0c3",
        gasUsed: 115111n,
        status: "success",
        to: "0x20c09acce0cae954715b30ad421d2836beda58db",
        transactionHash: "0xdf5723ba07f233c34cc0885818c994acb7972dcbdec618f638137f163a2cb453",
        transactionIndex: 2
    }
    const buyCreatedCoin = async ({ buyTxHash, txData }) => {
        try {


            if (txData?.status === "success" && buyTxHash) {
                const apiResponse = await BuyToken({
                    account_type: "bsc",
                    amount: parseFloat(preTokenBuy),
                    token_amount: "0",
                    token_id: createCoinRes?._id,
                    type: "buy",
                    transaction_hash: buyTxHash,
                });
                console.log("api response after buying", apiResponse)

                if (apiResponse?.status === 201) {
                  if(toastId) { toast.update(toastId, {
                        render: "Token bought successfully!",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000, // Auto dismiss after 3 seconds
                      });}
                   // toast.success(apiResponse.message);
                    resetForm();
                    navigate('/');
                    dispatch(fetchCoins({ sortBy: sortOption, coinSorting: "" }));
                    setIsCreatingCoin(false);
                } else {
                    throw new Error(`Failed to Buy tokens`);

                }
            } else {
                toast.error('Transaction failed. Please try again now.');
                setIsCreatingCoin(false);
                if (toastId) { toast.update(toastId, { render: "Failed to record buy transaction", type: "error", isLoading: false, autoClose: 3000 }); }

            }

        } catch (error) {
            setIsCreatingCoin(false);
            if (toastId) { toast.update(toastId, { render: "Failed to record buy transaction", type: "error", isLoading: false, autoClose: 3000 }); }

            console.log("error while buyin token", error)
        }
    }
    return (
        <div className='border flex justify-center items-center py-[55px] px-4 w-full pb-[100px]'>
            <div className='relative w-full max-w-[830px] border-t-[5px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]'>
                <div className='absolute top-0 left-0 h-[5px] w-full bg-white'></div>


                <BoxHeader label='Launch Token' />
                <div className='secondary-bg p-[14px]'>
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <div className='h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]'>

                            <div className='flex flex-col gap-9 p-[20px]'>

                                <div className='flex flex-col sm:flex-row gap-6 sm:gap-2'>
                                    <InputField label="Name:" value={name} onChange={(e) => setName(e.target.value)} checkRequired={true} />
                                    <InputField label="Ticker:" value={ticker} onChange={(e) => setTicker(e.target.value)} checkRequired={true} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label
                                        htmlFor="imageUpload"
                                        className="formLabel min-w-auto md:min-w-[150px] text-right"
                                    >
                                        *Image:
                                    </label>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden" // Hide the default file input
                                    />
                                    {imageUrl ? (
                                        <div className="w-[100px]">
                                            <label htmlFor="imageUpload" className="cursor-pointer">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                                                    alt="Uploaded"
                                                    className="border border-gray-300 rounded"
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label htmlFor="imageUpload" className="cursor-pointer">
                                            <img src={folder} alt="Folder icon" />
                                        </label>
                                    )}
                                </div>
                                {/* <div className='flex items-center gap-4'>
                                    <label htmlFor="imageUpload" className='formLabel min-w-auto md:min-w-[150px] text-right'>*Image:</label>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden" // Hide the default file input
                                    />
                                    <label htmlFor="imageUpload" className="cursor-pointer">
                                        <img src={folder} alt="Folder icon" />
                                    </label>
                                    {fileName && <span className="ml-2 text-gray-700">{fileName}</span>}
                                </div> */}
                                {/* {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-20 h-20 object-cover" />} */}

                                <TextArea value={description} onChange={(e) => setDescription(e.target.value)} checkRequired={true} />

                                <div className='flex flex-col sm:flex-row gap-6 sm:gap-2'>

                                    <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                                        <label className="formLabel min-w-auto md:min-w-[150px] text-right">*Reveal Time:</label>
                                        <div className="flex flex-col gap-2 w-full">
                                            {/* Time Selection */}
                                            <div className="flex flex-wrap gap-2 Inter">
                                                {[5, 15, 30, 60, 120, 1440].map((minutes) => (
                                                    <button
                                                        key={minutes}
                                                        onClick={() => handleTimeSelect(minutes)}
                                                        className={`px-4 py-2 rounded-md border ${selectedMinutes === minutes
                                                            ? "bg-purple-600 text-white"
                                                            : "bg-gray-200 text-gray-800"
                                                            }`}
                                                    >
                                                        {minutes < 60 ? `${minutes} Min` : `${minutes / 60} Hour${minutes > 60 ? "s" : ""}`}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Reveal Time Display */}
                                            {revealTime && (
                                                <div className="mt-4 Inter">
                                                    <strong>Reveal Time:</strong> {revealTime}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* <InputField label="Initial Buy:" /> */}

                                </div>

                                {/* <InputField label="Supply:" value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} type='number' /> */}
                                <InputField label="Website (Optional):" value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)} />
                                <InputField label="Telegram (Optional):" value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)} />
                                <InputField label="Twitter (Optional):" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} />



                                <div className='mx-auto'>
                                    <button className={`themeBtn SegoeUi w-fit ${iscreatingCoin ? "animate-pulse" : "animate-none"}`}
                                        onClick={(() => {

                                            handleSubmit()

                                        })}
                                    ><span>
                                            {iscreatingCoin ? "Launching ..." : " Launch Token"}
                                        </span>
                                    </button>
                                </div>


                                {/* <div className='mx-auto'>
                                    <button className='themeBtn SegoeUi w-fit' onClick={handleLaunchToken}><span>Launch Token</span></button>
                                </div> */}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            <EthCreatorBuyToken
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tokenName={name}
                isEthToToken={isEthToToken}
                setIsEthToToken={setIsEthToToken}
                tokenToBuy={tokenToBuy}
                setTokenToBuy={setTokenToBuy}
                amount={preTokenBuy}
                setAmount={setPreTokenBuy}
                handleLaunchToken={createToken}
                userSolBalnace={block_chain === "SOL" ? userSolBalnace : balanceData?.formatted}
                imageUrl={imageUrl}
                setIsCreatingCoin={setIsCreatingCoin}
            />
        </div >
    );
};

export default LaunchTokens;
