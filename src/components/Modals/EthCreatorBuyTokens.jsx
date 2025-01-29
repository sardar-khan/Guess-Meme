import React, { useCallback, useEffect, useState } from 'react';
import ethImg from "../../assets/icons/eth.png";
import solImg from "../../assets/icons/sol.webp";
import { useAppKitProvider } from '@reown/appkit/react';
import { toast } from 'react-toastify';
import { reterieveUserSolanaBalance, TokenPriceCalculations } from '../PlaceTrade/solanaBuySellFunction';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { selectedName } from '../../utils/helper';
import { parseUnits } from 'viem';
import { useWalletContext } from '../../context/WalletContext';
import { getBuySellInEthBuy } from '../PlaceTrade/TokenPriceCalculations';
import { calculateTokenEthValues } from '../PlaceTrade/ether-trade-utils';

// import { useReadContract } from 'wagmi'


const EthCreatorBuyToken = ({ isOpen, onClose, tokenName, isEthToToken, setIsEthToToken, tokenToBuy, setTokenToBuy, amount, setAmount, handleLaunchToken, userSolBalnace, imageUrl, setIsCreatingCoin }) => {
    const {block_chain} = useWalletContext()
   
console.log("user-sol-balane",tokenToBuy)
    const [accountSolBalance, setAccountSolBalance] = useState({
        reason: "0",
        hasError: 0,
    });

    if (!isOpen) return null;

    

    const deployToken = () => {

        setIsCreatingCoin(true);
        onClose();
        handleLaunchToken();
    }

    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
            style={{ zIndex: '2000' }}
            onClick={onClose}
        >
            <div
                className='bg-[#A49DD2] p-5 z-[1000] rounded-lg w-[90%] max-w-md'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-xl Inter text-center font-semibold mb-3'> Choose how many <span className=' text-purple-900 text-lg font-bold '>{tokenName}</span> you want to buy  <span className='font-sans'>(optional)</span></h3>
                <p className='text-sm Inter text-center  mb-3'>tip: its optional but buying a small amount of coins helps protect your coin from snipers</p>

                {/* <SwitchBuyToken
                    tokenName={tokenName}
                    isEthToToken={isEthToToken}
                    setIsEthToToken={setIsEthToToken}
                    block_chain={block_chain}
                /> */}
                {/* Input Fields */}
                <div className='flex flex-col gap-2'>


                    <div className="w-full Inter">
                        <div className="w-full border-[3px] border-b-[5px] border-r-[5px] border-[#353535] border-t-[4px] border-t-[#353535] border-l-[#353535] border-b-[#F2F2F2] border-r-[#CBC7E5]">
                            <div className="flex w-full justify-between border-[3px] border-t-[#7D73BF] border-l-[4.2px] border-l-[#7D73BF] border-b-[2px] border-b-[#F2F2F2] border-r-[#fff]">
                                <input
                                    type="number"
                                    name="amount"
                                    value={isEthToToken ? amount : tokenToBuy}
                                    placeholder='Amount'
                                    className="w-full px-2 py-3 pr-4"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value || Number(value) >= 0) {
                                            isEthToToken ? setAmount(value) : setTokenToBuy(value)
                                        }
                                    }}
                                />
                                <div className="w-fit flex items-center gap-1 bg-white">
                                    <span className="text-black font-semibold text-sm SegoeUi">
                                        {selectedName(block_chain, isEthToToken, tokenName)}
                                    </span>

                                    <SelectedImage
                                        isEthToToken={isEthToToken}
                                        block_chain={block_chain}
                                        imageUrl={imageUrl}
                                        tokenName={tokenName}
                                    />
                                </div>
                            </div>

                        </div>
                        {/* token calculations */}
                        <PriceCalculations
                            amount={amount}
                            setAmount={setAmount}
                            isEthToToken={isEthToToken}
                            tokenToBuy={tokenToBuy}
                            setTokenToBuy={setTokenToBuy}
                            tokenName={tokenName}
                        />
                    </div>
                    {userSolBalnace > amount ? null : <div className="text-red-500 text-xs">Insufficient balance</div>}
                </div>

                {/* Buttons */}
                <div className='flex flex-col py-4 sm:flex sm:flex-row justify-end mt-4 gap-1 sm:gap-3'>
                    <button
                        onClick={onClose}
                        className='w-full sm:w-fit px-4 py-2 bg-gray-300 sm:!text-base text-xs'
                    >
                        Cancel
                    </button>
                    <button
                        className='themeBtn w-full sm:w-fit'
                        onClick={() => {
                            userSolBalnace > amount &&
                                deployToken();
                        }}
                    >
                        <span className='!text-xs sm:!text-base'>Create Coin</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EthCreatorBuyToken;


const SwitchBuyToken = ({ tokenName, isEthToToken, setIsEthToToken ,block_chain}) => {
    
    return (

        <div className='flex Inter items-center justify-end'>
            <button onClick={(() => { setIsEthToToken(!isEthToToken) })} className='text-base  tracking ease-in-out transition-all duration-300 hover:bg-purple-500 hover:text-white p-1.5 rounded-md mb-2'>
                switch to {isEthToToken ? tokenName : block_chain}
            </button>
        </div>
    );
}


const SelectedImage = ({ isEthToToken, block_chain, imageUrl, tokenName }) => {

    return (
        <> {block_chain === "ETH" ?
            <img
                src={isEthToToken ? ethImg : `${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                className="w-[30px] mr-5"
                alt={selectedName(block_chain, isEthToToken, tokenName)}
            /> :
            <img
                src={isEthToToken ? solImg : `${import.meta.env.VITE_API_URL.slice(0, -1)}${imageUrl}`}
                className="w-[30px] mr-5"
                alt={selectedName(block_chain, isEthToToken, tokenName)}
            />

        }</>
    );

}

const PriceCalculations = ({ amount, setAmount, isEthToToken, tokenToBuy, setTokenToBuy, tokenName }) => {
    const [price, setPrice] = useState({});
    const [contractInfo,setContractInfo]=useState('');

    //  useEffect(()=>{
    //         GetContractConfiguration(block_chain).then(async(res)=>{
    //         console.log("block-info",res);
    //         setContractInfo(res);
    //       })
          
    
    //     },[block_chain])


    //fetch price conversions for token
    const fetchPrice = async () => {
        // const result = useReadContract({
        //     abi,
        //     address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        //     functionName: 'totalSupply',
        //   })
        
        try {
            //const res1 = await tokenToEthConversion(useReadContract,"0x7D3Fb449FbD018af1898c13e0c3b5382aF20501d", tokenToBuy,contractInfo)
            const res = await calculateTokenEthValues(
                "",
                isEthToToken ? amount === '' ? 0 : amount : tokenToBuy === '' ? 0 : tokenToBuy,
                isEthToToken,
                false
            );
            setPrice(res);
            isEthToToken ? setTokenToBuy(res?.tokensbuy) : setAmount(res?.tokensbuy)
            console.log("after switch", "amunt", amount, "tokentobuy", tokenToBuy);
            // Store the response in state to render it
        } catch (error) {
            console.error("Error fetching token price:", error);
        }
    }


    useEffect(() => {
        fetchPrice();  // Fetch the price whenever dependencies change
    }, [amount, isEthToToken, tokenToBuy]);

    return (
        <div className='pt-2'>
            {isEthToToken ?
                <span>You receive : {price?.tokensbuy} {tokenName}</span>
                :
                <span>Cost : {price?.tokensbuy} ETH</span>
            }
        </div>
    );
}

