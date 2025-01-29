//import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
// import { Keypair, Connection, PublicKey } from "@solana/web3.js";
// import bs58 from "bs58";
// import IDL1 from "./solIdl.json";


// const programId = new PublicKey(
//     "7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh"
// );

// const RPC_URL = "https://api.devnet.solana.com";
// const connection = new Connection(RPC_URL, "confirmed");

// const feeRecipient = new PublicKey(
//     "GTwY38pfmivyecwZtevaT14N3WDHMQebrrWjt2i48E29"
// );

// const SELLSLIPPAGE = 50;

// const mintaddy = new PublicKey(
//     "qVsZ9LG4pp2cKRuCDkXrL3RDZPGFK6vLyZUGSQQJ2Uj"
// );

// const DEV_KEY = "4Suo836P86rZ1n3ZMdCXn5R7YEerQg5D3s862WsdatJYdccPsPmEr1TYuqfsJqVrqF8HAbBdxbaYVqXfWCcgXeKo";

// const wallet = new Wallet(Keypair.fromSecretKey(bs58.default.decode(DEV_KEY)));

// const provider = new AnchorProvider(connection, wallet, {
//     commitment: "confirmed",
// });

// const program = new Program(IDL1, programId, provider);

// export {
//     programId,
//     connection,
//     feeRecipient,
//     SELLSLIPPAGE,
//     mintaddy,
//     wallet,
//     provider,
//     program
// };

import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import IDL1 from "./solIdl.json"; // Ensure the JSON file is accessible in your build
import IDL2 from "./idl2.json"; 
import { WalletProvider } from "@solana/wallet-adapter-react";

const programId = new PublicKey(
    "7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh"
);

const RPC_URL = "https://api.devnet.solana.com";
const connection = new Connection(RPC_URL, "confirmed");

const feeRecipient = new PublicKey(
    "GTwY38pfmivyecwZtevaT14N3WDHMQebrrWjt2i48E29"
);

const SELLSLIPPAGE = 50;

const mintaddy = new PublicKey(
    "F2ysZLbZkNksxhj3hAfQ7R84zusC8Xgw12VyfPB83EkZ"
);

// Replace with your private key
const DEV_KEY = "4Suo836P86rZ1n3ZMdCXn5R7YEerQg5D3s862WsdatJYdccPsPmEr1TYuqfsJqVrqF8HAbBdxbaYVqXfWCcgXeKo";

// Create a Keypair from the secret key
const keypair = Keypair.fromSecretKey(bs58.decode(DEV_KEY));

// Implement a wallet that provides a `publicKey` and `signTransaction` method
const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx) => {
        tx.partialSign(keypair);
        return tx;
    },
    signAllTransactions: async (txs) => {
        txs.forEach((tx) => tx.partialSign(keypair));
        return txs;
    },
};

const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
});
 function Buy_createTransactionInstruction(
    signerPublicKey, // Public key of the signer account
    programPublicKey, // Public key of the program to interact with
    associatedTokenPublicKey, // Public key of the associated token account
    mintPublicKey // Public key of the mint account
  ) {
    const accounts = [
      {
        pubkey: signerPublicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: programPublicKey,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: associatedTokenPublicKey,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mintPublicKey,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        isSigner: false,
        isWritable: false,
      },
    ];
  
    const data = Buffer.alloc(0);
  
    return new TransactionInstruction({
      keys: accounts,
      programId: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
      data,
    });
  }

const program = new Program(IDL1, programId, WalletProvider);

export {
    programId,
    connection,
    feeRecipient,
    Buy_createTransactionInstruction,
    SELLSLIPPAGE,
    mintaddy,
    wallet,
    provider,
     program,
    
    IDL1,
    IDL2
};
