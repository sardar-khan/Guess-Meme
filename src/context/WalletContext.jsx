import { createContext, useContext, useEffect, useState } from "react";

const WalletContext = createContext(undefined)

export const WalletApi = ({ children }) => {

    const [block_chain, setBlock_chain] = useState(localStorage.getItem('blockchain'))

    useEffect(() => {
        setBlock_chain(localStorage.getItem('blockchain'))
        console.log("getBlockChain IN context", block_chain)
    }, [block_chain, localStorage.getItem('blockchain')])


    return (
        <WalletContext.Provider value={{ block_chain, setBlock_chain }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => useContext(WalletContext);


export default WalletContext;