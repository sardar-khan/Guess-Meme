import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ethImg from "../../assets/icons/eth.png";
import solImg from "../../assets/icons/sol.webp";
import { BuyToken } from "../../utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchTrades } from "../../features/tradesSlice";
import { connection } from "./config";
import { buy, reteriveTokenDetails, sell, TokenPriceCalculations } from "./solanaBuySellFunction";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWallet } from '@solana/wallet-adapter-react'
import { useAppKitProvider } from '@reown/appkit/react';
import SetSlipPage from "../Modals/SetSlipPage";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWalletContext } from "../../context/WalletContext";
// eslint-disable-next-line react/prop-types
const PlaceTradeSol = ({ refresh, setRefresh, coinData, tokenid }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isSlipPageOpen, setIsSlipPageOpen] = useState(false);
    const wallet = useWallet()
    const [showSOGs, setShowSOGs] = useState(false);
    const { block_chain } = useWalletContext()
    const tokenAddress_mint = tokenid && block_chain === 'SOL' ? new PublicKey(tokenid) : null;
  


    const [amount, setAmount] = useState("");
    const [userBalance, setUserBalance] = useState({
        tokenBalance: null,
        solBalance: null,
    })
    const [amountError, setAmountError] = useState({
        error: false,
        reason: '',
    })
    const [maxBuyTokens, setMaxBuyTokens] = useState('')
    const [tokenToBuy, setTokenToBuy] = useState('')
    const [remaningTokens, setRemaningTokens] = useState('')
    const [solAmount, setSolAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const { walletProvider } = useAppKitProvider('solana');
    const [tradeType, setTradeType] = useState("buy"); // Default trade type is "buy"
    const { isConnected } = useAppKitAccount()
    const [slipage, setSlipage] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [prorityFee, setPriorityFee] = useState('');

    useEffect(() => {
        console.log("checking",tokenid && walletProvider,tokenid , walletProvider)
        if (tokenid && walletProvider) {
            getUserBalances()
          
            remaningAndMaxbuyTokens(tokenid)
        }
    }, [amount, coinData, wallet, tokenToBuy, walletProvider])



    const handleSwitchClick = async () => {

        setShowSOGs(!showSOGs);
        if (!showSOGs) {
            setAmount(tokenToBuy);
        } else {
            setAmount(solAmount);
        }

    };

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

    const handleTrade = async () => {
        setIsLoading(true);
        if (!isConnected) return toast.error("Please connect wallet")
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) toast.error("Please enter a valid amount")
        if (block_chain === "SOL" && tradeType === 'buy') {

            buyTokens()
        }
        else if (block_chain === "SOL" && tradeType === 'sell') {
            sellTokens()
        }
    };

    const buyTokens = async () => {
        try {

            const buySuccess = await buy(walletProvider, tokenToBuy, tokenAddress_mint, slipage);
            if (buySuccess?.success) {
                setAmount('')
                setTokenToBuy('')
                setSolAmount('')
                const apiResponse = await BuyToken({
                    account_type: 'solana',
                    amount: parseFloat(tokenToBuy),
                    token_amount: parseFloat(solAmount),
                    token_id: id,
                    type: tradeType,
                    transaction_hash: buySuccess?.data,
                });
                if (apiResponse?.status === 201) {
                    toast.success(`Transction Successfull: ${buySuccess?.data}`)
                    setRefresh(!refresh);
                    dispatch(fetchTrades(id)); // Fetch updated trades
                    setIsLoading(false);

                } else {
                    setIsLoading(false);
                    throw new Error(
                        `Failed to record ${tradeType} trade in the backend`
                    );
                    
                }


            }else{
                toast.error(`${buySuccess?.error}`)
                setIsLoading(false);
            }
        } catch (error) {
            toast.error(error.message || `Error placing ${tradeType} trade`);
            console.log("error while buying tokens", error)
            setIsLoading(false);
        }
    }

    const sellTokens = async () => {
        try {


            const sellTrxHash = await sell(walletProvider, amount, tokenAddress_mint);

            if (sellTrxHash?.success) {
                setAmount('')
                setSolAmount('')
                setTokenToBuy('')
                // toast.success("Successfully Sell")
                const apiResponse = await BuyToken({
                    account_type: 'solana',
                    amount: parseFloat(amount), // no of tokens to be deducted
                    token_amount: parseFloat(solAmount).toFixed(10), // amount of sol to be received 
                    token_id: id,
                    type: tradeType,
                    transaction_hash: sellTrxHash?.data,
                });
                if (apiResponse?.status === 201) {
                    toast.success(`Transction Successfull: ${sellTrxHash?.data}`)
                    setRefresh(!refresh);
                    dispatch(fetchTrades(id)); // Fetch updated trades
                    setIsLoading(false);

                } else {
                    setIsLoading(false);
                    throw new Error(
                        `Failed to record ${tradeType} trade in the backend`
                    );
                }
            } else {
                toast.error(`${sellTrxHash?.error}`)
                setIsLoading(false);
            }

        } catch (error) {
            setIsLoading(false);
            toast.error(error.message || `Error placing ${tradeType} trade`);
            console.log("error while selling tokens", error)
        }
    }

    //calculate token values for buy
    const handleAmount = async (val) => {

        const res = await TokenPriceCalculations(
            tokenid,
            val === '' ? 0 : val,
            !showSOGs,
            true
        )

        if (!showSOGs) {
            if(!walletProvider){
               return setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: 'Please connect your wallet!',
                }))
            }
           

            if (res?.tokensbuy > maxBuyTokens) {

                return setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: 'max buy exceeded',
                }))
                
            }

            if ( res?.tokensbuy > remaningTokens) {
                return setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: 'Max token reserved reached',
                }))

            }
            
            if (val < userBalance?.solBalance) {
                setSolAmount(val)
                setAmount(val)

                setTokenToBuy(res?.tokensbuy)
                setAmountError((prevState) => ({
                    ...prevState,
                    error: false,
                    reason: '',
                }))
            } else {

                setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: `you don't have enough sol`,
                }))
            }
        }
        else {
            if(!walletProvider){
               return setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: 'Please connect your wallet!',
                }))
            }

            if (val > maxBuyTokens) {

                return setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: 'max buy exceeded',
                }))

            }
            if (
                val > remaningTokens
            ) {
                return setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: 'Max token reserved reached',
                }))

            }

            if (res?.tokensbuy < userBalance?.solBalance) {
                setSolAmount(res?.tokensbuy)
                setAmount(val)

                setTokenToBuy(val)
                setAmountError((prevState) => ({
                    ...prevState,
                    error: false,
                    reason: '',
                }))
            } else {

                setAmountError((prevState) => ({
                    ...prevState,
                    error: true,
                    reason: `you don't have enough sol`,
                }))
            }
        }


    }

    const handleAmountSell = async (val) => {
        const res = await TokenPriceCalculations(
            tokenid,
            val === '' ? 0 : val, false, true
        )
        if (val <= userBalance?.tokenBalance) {
            setSolAmount(res?.tokensell)
            setAmount(val)

            setTokenToBuy(val)
            setAmountError((prevState) => ({
                ...prevState,
                error: false,
                reason: '',
            }))
        } else {

            setAmountError((prevState) => ({
                ...prevState,
                error: true,
                reason: `you don't have enough tokens`,
            }))
        }



    }

    const getUserBalances = async () => {
        try {
            if (!tokenid) { return }
            //user-sol-balance
            const balance = await connection.getBalance(walletProvider.publicKey)

            //user-selected-token-balance
            const tokenMintAddress = new PublicKey(tokenid)

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

    const handleBuyPercentage = (percentage) => {
        const perctageSet = userBalance?.tokenBalance * (percentage / 100);
        setAmount(perctageSet);
        handleAmountSell(perctageSet)



    }


    return (
        <div className="border flex justify-center items-center w-full ">
            <div className="relative w-full border-t-[1px] border-t-[#fff] border-l-[5px] border-l-[#fff] border-r-[2px] border-r-[#353535] border-b-[2px] border-b-[#353535]">
                <div className="absolute top-0 left-0 h-[5px] w-full bg-white"></div>
                <div className="secondary-bg p-[14px]">
                    <div className="h-full w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                        <div className="h-full flex w-full justify-between gap-1 border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                            <div className="w-full flex flex-col pb-4 pt-2">
                                <div className="rounded">
                                    <div className="flex gap-1 px-3">
                                        <button
                                            className={`text-[16px] SegoeUi font-semibold text-center w-full px-3 py-2 rounded ${tradeType === "buy"
                                                ? "bg-[#4ADE80] text-[#202020]"
                                                : "bg-[#1F2937] text-[gray]"
                                                }`}
                                            onClick={() => { setTradeType("buy"); setAmount(''); setSolAmount('') }}
                                        >
                                            Buy
                                        </button>
                                        <button
                                            className={`text-[16px] SegoeUi font-semibold text-center w-full px-3 py-2 rounded ${tradeType === "sell"
                                                ? "bg-[#F87171] text-white"
                                                : "bg-[#1F2937] text-[gray]"
                                                }`}
                                            onClick={() => { setTradeType("sell"); setShowSOGs(true); setAmount(''); setSolAmount('') }}
                                        >
                                            Sell
                                        </button>

                                    </div>

                                    <div className="flex justify-between gap-3 px-3 pt-[35px]">
                                        {tradeType === 'buy' && block_chain !== 'ETH' ?
                                            <span
                                                className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer"
                                                onClick={coinData?.status === "deployed" && handleSwitchClick}
                                            >
                                                {showSOGs ? `Switch to ${block_chain}` : `Switch to ${coinData?.name}`}
                                            </span>
                                            :
                                            <span></span>
                                        }

                                        <div>
                                            <span
                                                className="SegoeUi bg-[#4E496E] px-2 py-1 rounded text-xs text-[#9CA3AF] font-semibold cursor-pointer"
                                                onClick={() => {

                                                    setIsSlipPageOpen(true)
                                                }}
                                            >
                                                Set max slippage
                                            </span>

                                            {/* SetSlipPage Modal */}
                                            <SetSlipPage
                                                isOpen={isSlipPageOpen}
                                                onClose={() => setIsSlipPageOpen(false)}
                                                setSlipage={setSlipage}
                                                setPriorityFee={setPriorityFee}


                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-3 px-3 pt-[15px]">
                                        {/* {!showSOGs && */}
                                        <div className="w-full Inter">

                                            {tradeType === 'buy' ?
                                                <div className={`
                          // ? 'border border-red-500'
                          'border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'
                           w-full `}>
                                                    <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            value={amount}
                                                            //  value={solAmount : }
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (!value || Number(value) >= 0) {
                                                                    handleAmount(value);
                                                                }
                                                            }}

                                                            className="w-full px-2 py-3 pr-4"
                                                        />

                                                        <div className="w-fit flex items-center gap-1 bg-white">
                                                            <span className="whitespace-nowrap text-black font-semibold text-sm SegoeUi">
                                                                {!showSOGs && block_chain !== 'ETH' ? block_chain : coinData?.name}
                                                                {/* {block_chain === "ETH" ? "ETH" : "SOL"} */}
                                                            </span>

                                                            <img
                                                                src={
                                                                    showSOGs
                                                                        ? `${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`
                                                                        : (block_chain === 'SOL' ? solImg : ethImg)
                                                                }
                                                                className="w-[30px] mr-7 rounded-full"
                                                            />

                                                        </div>
                                                    </div>


                                                </div>
                                                :
                                                <div className={`
                          'border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]'
                           w-full `}>
                                                    <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            value={amount}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (!value || Number(value) >= 0) {
                                                                    handleAmountSell(value);
                                                                }
                                                            }}
                                                            className="w-full px-2 py-3 pr-4"
                                                        />

                                                        <div className="w-fit flex items-center gap-1 bg-white">
                                                            <span className="whitespace-nowrap text-black font-semibold text-sm SegoeUi">
                                                                {coinData?.name}
                                                            </span>
                                                            <img
                                                                src={`${import.meta.env.VITE_API_URL.slice(0, -1)}${coinData?.image}`}
                                                                className="w-[30px] mr-7 rounded-full"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {!showSOGs && tradeType === 'buy' &&
                                    <div className='flex justify-start items-center gap-[3px] mt-3 ml-3'>
                                        <span onClick={() => { setAmount(''); handleAmount('') }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            reset
                                        </span>
                                        <span onClick={() => { setAmount(0.1); handleAmount(0.1) }} className='Inter whitespace-nowrap px-1 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            0.1 {block_chain}
                                        </span>
                                        <span onClick={() => { setAmount(0.5); handleAmount(0.5) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            0.5 {block_chain}
                                        </span>
                                        <span onClick={() => { setAmount(1); handleAmount(1) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            1 {block_chain}
                                        </span>
                                    </div>
                                }
                                {tradeType === 'sell' &&
                                    <div className='flex justify-start items-center gap-[3px] mt-3 ml-3'>
                                        <span onClick={() => { setAmount(''); handleBuyPercentage('') }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            reset
                                        </span>
                                        <span onClick={() => { handleBuyPercentage(25) }} className='Inter whitespace-nowrap px-1 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            25 %
                                        </span>
                                        <span onClick={() => { handleBuyPercentage(50) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            50 %
                                        </span>
                                        <span onClick={() => { handleBuyPercentage(75) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            75 %
                                        </span>
                                        <span onClick={() => { handleBuyPercentage(100) }} className='Inter whitespace-nowrap px-2 py-1 rounded text-[10px] text-[#9CA3AF] bg-[#4E496E] font-semibold cursor-pointer'>
                                            100 %
                                        </span>
                                    </div>
                                }

                                {amount != '' && tokenToBuy != '' && tokenToBuy != '0' && tokenToBuy != 0 && block_chain == "SOL" && <p p className="mt-2 ml-3">{!showSOGs ? tokenToBuy : solAmount} {showSOGs ? block_chain : coinData?.name}</p>}
                                {amount != '' && <p p className="mt-2 ml-3"> {block_chain}</p>}

                                {amountError.error && <p className="text-red-700 mt-2 ml-3">{amountError.reason}</p>}

                                <button
                                    className="themeBtn Inter w-fit mt-5 mx-auto"
                                    onClick={handleTrade}
                                    disabled={isLoading || amountError.error || isButtonDisabled}
                                >
                                    <span>{isLoading ? "Processing..." : "Trade"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PlaceTradeSol;

