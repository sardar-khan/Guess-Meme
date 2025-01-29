import React, { useEffect, useState } from 'react';
import ethImg from "../assets/icons/eth.png";
import solImg from "../assets/icons/sol.webp";
import { buy, reteriveTokenDetails, retrieveTokenMetaData, TokenPriceCalculations } from './PlaceTrade/solanaBuySellFunction';
import { BuyToken, getCoinByWalletAddress, viewCoin } from '../utils/api';

import { useDispatch } from "react-redux";
import { useAppKitProvider } from '@reown/appkit/react';
import { selectedName } from '../utils/helper';
import { useWalletContext } from '../context/WalletContext';
import { toast } from 'react-toastify';
import { connection } from './PlaceTrade/config';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { fetchTrades } from '../features/tradesSlice';



const DirectBuy = ({ isOpen, onClose }) => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenToBuy, setTokenToBuy] = useState('');
    const blockchainType = localStorage.getItem("blockchain") || "SOL";
    const [isSoltoToken, setIsSoltoToken] = useState(false);
    const [coinData, setCoinData] = useState(null);
    const { walletProvider } = useAppKitProvider('solana');
    const [amountError, setAmountError] = useState({
        error: false,
        reason: '',
    })
    const dispatch = useDispatch();
    const { block_chain } = useWalletContext()

    if (!isOpen) return null;



    const handleAddresChange = (e) => {
        setTokenAddress(e.target.value);
        getCoinByWalletAddress(e.target.value).then((res) => {
            if (res.status === 200) {
                console.log("directyBuy", res)
                setCoinData(res.data)
            } else {
                setCoinData(null);
            }
        })

    }



   

    const buyTokens = async () => {
        try {
            setIsLoading(true);
            const buySuccess = await buy(walletProvider, tokenToBuy, new PublicKey(coinData?.token_address));
            console.log("bueysss",buySuccess)
            if (buySuccess?.success) {
                setAmount('')
                setTokenToBuy('')
                const apiResponse = await BuyToken({
                    account_type: 'solana',
                    amount: tokenToBuy,
                    token_amount:amount,
                    token_id: coinData?._id,
                    type: "buy",
                    transaction_hash: buySuccess?.data,
                });
                if (apiResponse?.status === 201) {
                    toast.success(`Transction Successfull: ${buySuccess?.data}`)

                    dispatch(fetchTrades(coinData?._id)); // Fetch updated trades
                    setIsLoading(false);

                } else {
                    setIsLoading(false);
                    throw new Error(
                        `Failed to record ${tradeType} trade in the backend`
                    );

                }


            } else {
                toast.error(`${buySuccess?.error}`)
                setIsLoading(false);
            }
        } catch (error) {
            toast.error(error.message || `Error placing ${tradeType} trade`);
            console.log("error while buying tokens", error)
            setIsLoading(false);
        }
    }

    const closeModal = () => {
        onClose();
        setTokenAddress('');
        setAmount('');
        setTokenToBuy('');
        setIsLoading(false);
    }


    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
            style={{ zIndex: '2000' }}
          
        >
            <div
                className='bg-[#A49DD2] p-5 z-[1000] rounded-lg w-[90%] max-w-md'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-semibold mb-3'>Direct Buy</h3>

                {/* Input Fields */}
                <div className='flex flex-col gap-2'>
                    {/* Token Address Input */}
                    <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <input
                            type='text'
                            className='w-full px-2 py-3'
                            placeholder='Token Address'
                            value={tokenAddress}
                            onChange={handleAddresChange}
                        />
                    </div>

                    {coinData && <SwitchBuyToken
                        tokenName={coinData?.name}
                        isSoltoToken={isSoltoToken}
                        setIsSoltoToken={setIsSoltoToken}
                    />}
                    {/* Amount Input */}
                    {/* <div className='h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'>
                        <input
                            type='number'
                            className='w-full px-2 py-3'
                            placeholder='Enter Amount'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div> */}
                    <div className="w-full Inter">
                        <div className="w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                            <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                                <input
                                    type="number"
                                    name="amount"
                                    value={isSoltoToken ? amount : tokenToBuy}
                                    placeholder='Amount'
                                    className="w-full px-2 py-3 pr-4"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value || Number(value) >= 0) {
                                            isSoltoToken ? setAmount(value) : setTokenToBuy(value)
                                        }
                                    }}
                                />
                                <div className="w-fit flex items-center gap-1 bg-white">
                                    <span className="text-black font-semibold text-sm SegoeUi">
                                        {selectedName(block_chain, isSoltoToken, coinData?.name)}
                                    </span>
                                    {coinData ? <SelectedImage
                                        isSoltoToken={isSoltoToken}
                                        block_chain={block_chain}
                                        imageUrl={coinData?.image}
                                        tokenName={coinData?.name}
                                    /> :
                                        <img
                                            src={blockchainType === "ETH" ? ethImg : solImg}
                                            className="w-[30px] mr-5"
                                            alt={blockchainType === "ETH" ? "ETH" : "SOL"}
                                        />}
                                </div>
                            </div>
                        </div>
                        {coinData && <PriceCalculations
                            amount={amount}
                            setAmount={setAmount}
                            isSoltoToken={isSoltoToken}
                            tokenToBuy={tokenToBuy}
                            setTokenToBuy={setTokenToBuy}
                            tokenName={coinData?.name}
                            tokenAddress={coinData?.token_address}
                            walletProvider={walletProvider}
                            amountError={amountError}
                            setAmountError={setAmountError}
                            
                        />}
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex flex-col sm:flex sm:flex-row justify-end mt-4 gap-1 sm:gap-3'>
                    <button
                        onClick={closeModal}
                        className='w-full sm:w-fit px-4 py-2 bg-gray-300 sm:!text-base text-xs'
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoading}
                        className={`themeBtn w-full sm:w-fit ${isLoading ? "animate-pulse" : "animate-none"} ease-in-out transition-all duration-300`}
                        onClick={buyTokens}
                    >
                        <span className={`'!text-xs sm:!text-base`}>{isLoading ? "In Process..." : "Buy"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectBuy;


const SwitchBuyToken = ({ tokenName, isSoltoToken, setIsSoltoToken }) => {
    return (

        <div className='flex Inter items-center justify-end'>
            <button onClick={(() => { setIsSoltoToken(!isSoltoToken) })} className='text-base  tracking ease-in-out transition-all duration-300 hover:bg-purple-500 hover:text-white p-1.5 rounded-md mb-2'>
                switch to {isSoltoToken ? tokenName : "SOL"}
            </button>
        </div>
    );
}



const SelectedImage = ({ isSoltoToken, block_chain, imageUrl, tokenName }) => {

    return (
        <> {block_chain === "ETH" ?
            <img
                src={isSoltoToken ? ethImg : `${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                className="w-[30px] mr-5"
                alt={selectedName(block_chain, isSoltoToken, tokenName)}
            /> :
            <img
                src={isSoltoToken ? solImg : `${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                className="w-[30px] mr-5"
                alt={selectedName(block_chain, isSoltoToken, tokenName)}
            />

        }</>
    );

}


const PriceCalculations = ({ amount, setAmount, isSoltoToken, tokenToBuy, setTokenToBuy, tokenName, tokenAddress, walletProvider , amountError , setAmountError }) => {
    const [price, setPrice] = useState({});
    const [remaningTokens, setRemaningTokens] = useState('')
    const [maxBuyTokens, setMaxBuyTokens] = useState('')
    const [userBalance, setUserBalance] = useState({
        tokenBalance: null,
        solBalance: null,
    })
    console.log("states",userBalance,amountError,maxBuyTokens,remaningTokens);
    //fetch price conversions for token
    const fetchPrice = async () => {


        try {
            //const res1 = await tokenToEthConversion(useReadContract,"0x7D3Fb449FbD018af1898c13e0c3b5382aF20501d", tokenToBuy,contractInfo)
            const res = await TokenPriceCalculations(
                tokenAddress,
                isSoltoToken ? amount === '' ? 0 : amount : tokenToBuy === '' ? 0 : tokenToBuy,
                isSoltoToken,
                true
            );
            console.log("result from the price", res);
            
            setPrice(res);
            isSoltoToken ? setTokenToBuy(res?.tokensbuy) : setAmount(res?.tokensbuy)
            console.log("after switch", isSoltoToken, "amunt", amount, "tokentobuy", tokenToBuy);
            console.log("after switch", isSoltoToken, "tokentobuy", tokenToBuy, "amunt", amount,"userBalance",userBalance);
            checkBuyConditions(parseFloat(tokenToBuy), parseFloat   (amount))
            // Store the response in state to render it
        } catch (error) {
            console.error("Error fetching token price:", error);
        }
    }

    const remaningAndMaxbuyTokens = async (tokenAddress) => {
        if (!walletProvider) {
            console.log("Please connect your wallet");
        }
        if (!tokenAddress) {
            return toast.error("Token address not found!")
        }
        try {
            const res = await reteriveTokenDetails(walletProvider, tokenAddress);
            console.log("result from the tokens", res);
            const maxBuyPercentage = 100
            const percentage = (res?.totalTokens * maxBuyPercentage) / 100;

            setMaxBuyTokens(percentage)
            setRemaningTokens(res?.remainingTokens)
        } catch (error) {
            console.log("error while fetching token details", error)

        }
    }

    const getUserBalances = async () => {
        try {
            if (!tokenAddress) { return }
            console.log("walletProvider", walletProvider,walletProvider.publicKey)
            //user-sol-balance
            const balance = await connection.getBalance(walletProvider.publicKey)

            //user-selected-token-balance
            const tokenMintAddress = new PublicKey(tokenAddress)

            const tokenAccounts =
                await connection.getParsedTokenAccountsByOwner(walletProvider.publicKey, {
                    mint: tokenMintAddress,
                })
            console.log('tokens about to cook', tokenAccounts)
            let tokenBalance
            if (tokenAccounts?.value?.length > 0) {
                tokenBalance =
                    tokenAccounts?.value[0]?.account?.data?.parsed?.info
                        ?.tokenAmount.uiAmount
                //console.log('user-token-balance', balance)
            } else {
            }
            setUserBalance((prevState) => ({
                ...prevState,
                solBalance: balance / LAMPORTS_PER_SOL,
                tokenBalance: tokenBalance === undefined ? 0 : tokenBalance,
            }))
        } catch (error) {
            console.log('error while fetching user balance', error)
        }
    }

   
    const checkBuyConditions = (tokens ,sol) => {
        console.log("dewana",tokens,sol,maxBuyTokens,remaningTokens)
        console.log("walletProvider", walletProvider)
        if (!walletProvider) {
            return setAmountError((prevState) => ({
                ...prevState,
                error: true,
                reason: 'Please connect your wallet!',
            }))
        }
        console.log("maxBuyTokens", tokens > maxBuyTokens,tokens , maxBuyTokens)
        if (tokens > maxBuyTokens) {
            return setAmountError((prevState) => ({
                ...prevState,
                error: true,
                reason: 'max buy exceeded',
            }))
        }

        console.log("maxBuyTokens", tokens > remaningTokens,tokens , remaningTokens)
        if (tokens > remaningTokens) {
            return setAmountError((prevState) => ({
                ...prevState,
                error: true,
                reason: 'Max token reserved reached',
            }))
        }
        console.log("userBalance", sol > userBalance?.solBalance,sol , userBalance?.solBalance)
        if (sol > userBalance?.solBalance) {
            setAmountError((prevState) => ({
                ...prevState,
                error: true,
                reason: 'Not Enough Sol Balance',
            }))
        }else{
            setAmountError((prevState) => ({
                ...prevState,
                error: false,
                reason: '',
            }))
        }
    }
    useEffect(() => {
        remaningAndMaxbuyTokens(tokenAddress);
        getUserBalances();
        fetchPrice();  // Fetch the price whenever dependencies change
    }, [amount, isSoltoToken, tokenToBuy]);

    return (
        <div className='pt-2'>
            {isSoltoToken ?
               <div className='flex flex-col'>
                 <span>You receive : {price?.tokensbuy} {tokenName}</span>
                 {amountError.error && <p className="text-red-700 mt-2 ">{amountError.reason}</p>}
               </div>
                :
                <div  className='flex flex-col'>
                <span>Cost : {price?.tokensbuy} SOL</span>
                {amountError.error && <p className="text-red-700 mt-2 ">{amountError.reason}</p>}
                </div>
            }
        </div>
    );
}
