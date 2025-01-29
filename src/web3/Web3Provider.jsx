import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { solanaDevnet, polygonAmoy, sepolia, bscTestnet } from "@reown/appkit/networks";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useEffect, useState } from "react";

export function Web3ModalProvider({ children }) {
  const [blockChain, setBlockChain] = useState(localStorage.getItem('blockchain') || 'SOL');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedChain = localStorage.getItem('blockchain') || 'SOL';
    setBlockChain(storedChain);
  }, []);

  const queryClient = new QueryClient();
  const projectId = "84072b7bf8a52cbefc58fcaceae93a20";
  const metadata = {
    name: "Guess.Meme",
    description: "guess meme project",
    url: "http://localhost:5173/",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  };

  // Configure adapters and wallets based on the selected blockchain
  const solanaWallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
  const ethereumNetworks = 
  blockChain === "ETH" ? [bscTestnet] :
  blockChain === "POL" ? [polygonAmoy] :
  blockChain === "BNB" ? [bscTestnet] :[];

  const activeAdapter = blockChain === "SOL"
    ? new SolanaAdapter({
        wallets: solanaWallets,
        defaultNetwork: solanaDevnet.id,
        onConnect: () => setIsConnected(true),
        onDisconnect: () => setIsConnected(false)
      })
    : new WagmiAdapter({
        networks: ethereumNetworks,
        projectId,
        ssr: true,
        defaultChainId: ethereumNetworks[0].id,
        features: {
          metamask: true,
          walletConnect: true,
          coinbase: true,
        },
        // onConnect: async ({ address, connector }) => {
        //   setIsConnected(true);
        //   if (window.ethereum) {
        //     const chainId = `0x${ethereumNetworks[0].id.toString(16)}`;
        //     try {
        //       await window.ethereum.request({
        //         method: 'wallet_switchEthereumChain',
        //         params: [{ chainId }],
        //       });
        //     } catch (switchError) {
        //       if (switchError.code === 4902) {
        //         const networkConfig = {
        //           chainId,
        //           chainName: ethereumNetworks[0].name, // Use dynamic network name
        //           rpcUrls: ethereumNetworks[0].rpcUrls,
        //           nativeCurrency: ethereumNetworks[0].nativeCurrency,
        //         };
        //         await window.ethereum.request({
        //           method: 'wallet_addEthereumChain',
        //           params: [networkConfig],
        //         });
        //       }
        //     }
        //   }
        // },
        // onDisconnect: () => setIsConnected(false)
      });

  createAppKit({
    adapters: [activeAdapter],
    networks: blockChain === "SOL" ? [solanaDevnet] : ethereumNetworks,
    projectId,
    metadata,
    allWallets: "HIDE",
    defaultChainId: blockChain === "SOL" ? solanaDevnet.id : ethereumNetworks[0].id,
    features: {
      email: false,
      socials: false,
      analytics: true,
      // ...(blockChain === "SOL"
      //   ? { phantom: true, solflare: true, metamask: false, coinbase: false }
      //   : { phantom: false, solflare: false, metamask: true, coinbase: true })
    },
    // disconnect: {
    //   enabled: true,
    //   callback: async () => {
    //     try {
    //       await activeAdapter.disconnect();
    //       setIsConnected(false);
    //     } catch (error) {
    //       console.error('Disconnect error:', error);
    //     }
    //   }
    // }
  });

  return blockChain !== "SOL" ? (
    <WagmiProvider config={activeAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  ) : (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}


