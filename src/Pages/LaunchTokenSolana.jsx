import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCoins } from '../features/coinSlice';
import folder from '../assets/icons/Group 110.png';
import BoxHeader from '../components/Global/BoxHeader';
import InputField from '../components/Global/InputField';
import TextArea from '../components/Global/TextArea';
import { createCoin, uploadImage } from '../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LaunchTokenSol from '../components/LaunchTokenDeduct/LaunchTokenSol';
import { useAppKitAccount } from '@reown/appkit/react';
import WalletContext, { useWalletContext, WalletApi } from '../context/WalletContext';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import { useAppKitProvider } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import CreatorBuyToken from '../components/Modals/CreatorBuyTokens';
import { launchSolToken, reterieveUserSolanaBalance } from '../components/PlaceTrade/solanaBuySellFunction';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const LaunchTokenSolana = () => {

    const { walletProvider } = useAppKitProvider('solana');
    const { connection } = useAppKitConnection()
    const dispatch = useDispatch();
    const { isConnected } = useAppKitAccount();
    const [name, setName] = useState('');
    const [userSolBalnace, setUserSolBalnace] = useState(0);
    const [preTokenBuy, setPreTokenBuy] = useState(false);
    const [ticker, setTicker] = useState('');
    const [iscreatingCoin, setIsCreatingCoin] = useState(false);
    const [revealTime, setRevealTime] = useState('');
    const [selectedMinutes, setSelectedMinutes] = useState(0); // Default to 0 minutes
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10)); // Only the date part
    const [isSoltoToken, setIsSoltoToken] = useState(false);
    const [tokenToBuy, setTokenToBuy] = useState(0);
    const [websiteLink, setWebsiteLink] = useState(null)
    const [telegramLink, setTelegramLink] = useState(null)
    const [twitterLink, setTwitterLink] = useState(null)
    const [description, setDescription] = useState('');
    const [maxSupply, setMaxSupply] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [fileName, setFileName] = useState('');

    const navigate = useNavigate();


    const { block_chain } = useContext(WalletContext);

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

    useEffect(() => {

        if (walletProvider) checkUserBalance()
    }, [preTokenBuy, walletProvider]);

    const checkUserBalance = async () => {
        const res = await reterieveUserSolanaBalance(walletProvider)

        if (res) {
            setUserSolBalnace(res / LAMPORTS_PER_SOL);
        }

    }





    const handleImageUpload = async (e) => {
        if (isConnected) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('profile_photo', file);

                try {
                    const data = await uploadImage(formData);
                    console.log("imageUrl", data.imageUrl);
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

    const handleRevealTimeChange = (e) => {
        const inputValue = e.target.value;

        // Extract year from the input
        const [year, month, day] = inputValue.split(/[-T]/);

        // If the year is more than 4 digits, truncate it
        if (year && year.length > 4) {
            const correctedYear = year.slice(0, 4);
            const correctedValue = correctedYear + inputValue.slice(4);
            setRevealTime(correctedValue);
        } else {
            setRevealTime(inputValue);
        }
    };
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setCurrentDate(selectedDate);

        // Update revealTime if a time has already been selected
        if (selectedMinutes > 0) {
            const updatedTime = calculateRevealTime(selectedDate, selectedMinutes);
            setRevealTime(updatedTime);
        }
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


    const createToken = async () => {

        if (!name || !ticker || !imageUrl || !description || !revealTime) {
            setIsCreatingCoin(false)
            toast.error('Please fill in all required fields: Name, Ticker, Image, Description, and Reveal Time.');
            return;
        }

        try {
            if (!walletProvider) {
                // return toast.error("Please connect your wallet");
                console.log("Please connect your wallet");
            }
            const formattedRevealTime = new Date(revealTime).toISOString();



            const isTokenCreated = await launchSolToken(
                name,
                ticker,
                imageUrl,
                100,
                tokenToBuy,
                walletProvider,
                connection,
                setIsCreatingCoin

            );

            console.log("transactionSuccess", isTokenCreated)
            if (!isTokenCreated.success) {
                toast.error('Transaction failed. Please try again now.');
                return;
            }

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
                hash: isTokenCreated?.hash,
                bondingCurve: isTokenCreated?.bonding_curve,
                tokenAddress: isTokenCreated?.token_address
            });
            console.log("response-creating-token", response)
            if (response.status === 200) {
                toast.success(response.message);
                resetForm();
                navigate('/');
                dispatch(fetchCoins({sortBy:'deployed',coinSorting:""}));
            } else {
                toast.error('Failed to create coin. Please try again.');
                setIsCreatingCoin(false)
            }
        } catch (error) {
            setIsCreatingCoin(false)
            toast.error('Error creating coin. Please try again.');
            console.error('Error creating coin:', error);
        }
    };


    const calculateRevealTime = (date, minutes) => {
        const baseDate = new Date(date);
        const revealTime = new Date(baseDate.getTime() + minutes * 60 * 1000);
        return revealTime.toISOString().replace("T", " ").slice(0, 16); // Format: "YYYY-MM-DD HH:MM"
    };


    const restrictYearInput = (e) => {
        const { value } = e.target;

        // Extract year part
        const yearPart = value.split("-")[0];

        // Prevent entering more than 4 characters in the year part
        if (yearPart.length >= 4 && e.key >= '0' && e.key <= '9') {
            e.preventDefault();
        }
    };


   

    // Open the modal to buy tokens
    const handleSubmit = async () => {
        if (!name || !ticker || !imageUrl || !description || !revealTime) {

            toast.error('Please fill in all required fields: Name, Ticker, Image, Description, and Reveal Time.');
            return;
        }
        setIsModalOpen(true);
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
                                </div>
                                <InputField label="Website (Optional):" value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)} />
                                <InputField label="Telegram (Optional):" value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)} />
                                <InputField label="Twitter (Optional):" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} />
                                <div className='mx-auto'>
                                    <button className='themeBtn SegoeUi w-fit'
                                    disabled={iscreatingCoin}
                                        onClick={(() => {

                                            handleSubmit()

                                        })}
                                    ><span>
                                           {iscreatingCoin? "Processing":"Launch Token"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            <CreatorBuyToken
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tokenName={name}
                isSoltoToken={isSoltoToken}
                setIsSoltoToken={setIsSoltoToken}
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

export default LaunchTokenSolana;
