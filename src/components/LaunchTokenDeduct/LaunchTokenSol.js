import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
import * as web3 from '@solana/web3.js'
import { useAppKitProvider } from '@reown/appkit/react';
import { adminSolAddress, LaunchTokenSolValue } from '../../services/config';
import { toast } from 'react-toastify';
import * as buffer from 'buffer'
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor'
import {  provider,feeRecipient, IDL1,connection,  SELLSLIPPAGE, wallet } from "../PlaceTrade/config";
import { Buy_createTransactionInstruction,b } from '../PlaceTrade/utils';


const LaunchTokenSol = () => {
   // const { connection } = useAppKitConnection();
    const { walletProvider } = useAppKitProvider('solana');


    // const handleLaunchToken = async (amount) => {


    //     console.log("amountsol", amount)
    //     try {
    //         console.log("Initiating SOL transfer...",connection);

    //         // Static recipient address
    //         const RECIPIENT_ADDRESS = new PublicKey(adminSolAddress);

    //         // Amount to send (0.03 SOL)
    //         console.log("amounsssst", amount)
    //         const plusAmount = Math.round((parseFloat(amount) + 0.03) * 1e9);
    //         console.log("plusAmount", plusAmount);
    //         console.log("LaunchTokenSolValue", LaunchTokenSolValue)


    //         const AMOUNT_TO_SEND = amount === undefined || null ? LaunchTokenSolValue * LAMPORTS_PER_SOL : plusAmount ;
    //         // const AMOUNT_TO_SEND = LaunchTokenSolValue * LAMPORTS_PER_SOL;
    //         console.log("AMOUNT_TO_SEND", AMOUNT_TO_SEND)
    //         // Check wallet balance
    //         const getBalanceWithRetry = async (connection, publicKey, retries = 3) => {
    //             for (let attempt = 0; attempt < retries; attempt++) {
    //                 try {
    //                     console.log("conneeee",connection,publicKey)
    //                     const bal = await connection.getBalance(publicKey);
    //                     console.log("balance",bal)
    //                     return bal
    //                 } catch (error) {
    //                     console.error(`Failed to fetch balance (Attempt ${attempt + 1}):`, error);
    //                     if (attempt === retries - 1) throw new Error("Failed to fetch balance after retries.");
    //                     await sleep(1000); // Retry after 1 second
    //                 }
    //             }
    //         };
    //         const balance = await getBalanceWithRetry(connection, walletProvider.publicKey);

    //         // const balance = await connection.getBalance(walletProvider.publicKey);
    //         if (balance < AMOUNT_TO_SEND) {
    //             toast.error("Insufficient balance in your wallet.");
    //             return false;
    //         }

    //         // Create transfer instruction
    //         const transferInstruction = SystemProgram.transfer({
    //             fromPubkey: walletProvider.publicKey,
    //             toPubkey: RECIPIENT_ADDRESS,
    //             lamports: AMOUNT_TO_SEND
    //         });

    //         // Create and send transaction
    //         const tx = new Transaction().add(transferInstruction);
    //         tx.feePayer = walletProvider.publicKey;

    //         // Get latest blockhash
    //         const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    //         tx.recentBlockhash = blockhash;

    //         // Sign and send transaction
    //         const signedTx = await walletProvider.signTransaction(tx);
    //         const txHash = await connection.sendRawTransaction(signedTx.serialize());
    //         console.log("Transaction Hash:", txHash);

    //         // Enhanced transaction status checking
    //         const MAX_RETRIES = 10;
    //         for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    //             try {
    //                 const { value: statuses } = await connection.getSignatureStatuses([txHash]);

    //                 console.log("Raw statuses:", JSON.stringify(statuses));

    //                 // Detailed logging of status
    //                 if (!statuses || statuses.length === 0) {
    //                     console.log(`Attempt ${attempt + 1}: No status found for transaction`);
    //                     await sleep(2000);
    //                     continue;
    //                 }

    //                 const status = statuses[0];

    //                 // More detailed status checking
    //                 if (!status) {
    //                     console.log(`Attempt ${attempt + 1}: Status is null`);
    //                     await sleep(2000);
    //                     continue;
    //                 }

    //                 console.log("Full status object:", JSON.stringify(status));

    //                 // Check for transaction success
    //                 if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
    //                     console.log(`Transaction confirmed on attempt ${attempt + 1}`);
    //                     console.log(`Explorer Link: https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    //                     return true;
    //                 }

    //                 // Log any errors
    //                 if (status.err) {
    //                     console.error("Transaction error:", status.err);
    //                     toast.error(`Transaction failed: ${JSON.stringify(status.err)}`);
    //                     return false;
    //                 }

    //                 // Wait before next attempt
    //                 await sleep(2000);
    //             } catch (statusError) {
    //                 console.error(`Error checking transaction status (Attempt ${attempt + 1}):`, statusError);
    //                 await sleep(2000);
    //             }
    //         }

    //         // If we've exhausted retries
    //         toast.error("Failed to confirm transaction after multiple attempts");
    //         return false;

    //     } catch (error) {
    //         console.error("Error while transferring SOL:", error);
    //         toast.error(`Transaction Error: ${error.message}`);
    //         return false;
    //     }
    // };

     const handleLaunchToken = async (
    
        name,
        symbol,
        image,
        buyPercentage,
        tokenAmount,
    ) => {
        console.log("props",name,symbol,image,buyPercentage,tokenAmount)
        // console.log('buyPercentage in func', buyPercentage, name, symbol, image)
        // if ((!name, !symbol, !image)) {
        //     return toast.error('Please fill out all the feilds')
        // }
        window.Buffer = buffer.Buffer
    
        //setLoading(true)
    
        try {
            
            // const connection = new web3.Connection(
            //     web3.clusterApiUrl('devnet', true),
            //     'confirmed',
            // )
            console.log('connection', connection)
    
            const programId = new web3.PublicKey(
                '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
            )
            // const provider = new AnchorProvider(connection, walletProvider, {
            //     commitment: 'confirmed',
            // })
            const program = new Program(IDL1, programId, walletProvider)
    
            const token_key = web3.Keypair.generate()
            console.log("Token address (public key):", token_key.publicKey.toBase58());
            const [C] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from('bonding-curve'), token_key.publicKey.toBuffer()],
                programId,
            )
            console.log('Bonding curve: ' + C.toBase58())
            const [S] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from('mint-authority')],
                programId,
            )
            console.log('s: ' + S.toBase58())
            const B = b(token_key.publicKey, C, !0)
            console.log('B: ' + B.toBase58())
            const MPL_TOKEN_METADATA_PROGRAM_ID =
                'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    
            const E = new web3.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
            console.log('E: ' + E.toBase58())
            const [O] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from('global')],
                programId,
            )
            console.log('O: ' + O.toBase58())
            const [D] = web3.PublicKey.findProgramAddressSync(
                [
                    Buffer.from('metadata'),
                    E.toBuffer(),
                    token_key.publicKey.toBuffer(),
                ],
                E,
            )
    
            console.log('D: ' + D.toBase58())
            const balance = await connection.getBalance(walletProvider.publicKey)
            console.log('balance', balance)
            if (!program || !connection) {
                //setLoading(false)
                return toast.error('Program or connection not initialized')
            }
    
            console.log('Addresses:', {
                token_key: token_key.publicKey.toBase58(),
                S: S.toBase58(),
                C: C.toBase58(),
                B: B.toBase58(),
                O: O.toBase58(),
                E: E.toBase58(),
                D: D.toBase58(),
            })
            console.log('program', program)
            // Construct the transaction
            const createInstruction = await program.methods
                .create(name, symbol, image, parseInt(buyPercentage))
                .accounts({
                    mint: token_key.publicKey,
                    mintAuthority: S,
                    bondingCurve: C,
                    associatedBondingCurve: B,
                    global: O,
                    mplTokenMetadata: E,
                    metadata: D,
                })
                .signers([token_key])
                .instruction()
    
            //buy call
            const maxSlippage = '10'
    
            const tokenAddress = token_key.publicKey
            //new web3.PublicKey(token_key.publicKey)
    
            const address2 = getAssociatedTokenAddressSync(
                tokenAddress,
                walletProvider.publicKey,
            )
            console.log('associated-token', address2.toBase58())
            // const tm=400
    
            const buy_value = maxSlippage?.toString() //Just for setting high slippage basically
            console.log('slippage', buy_value)
            console.log('tokenamttt', tokenAmount)
    
            const tokenamt = tokenToSmallestUnit(parseInt(tokenAmount), 6) //remaining token amount based on calling ts-node retrieve.ts
            console.log('  tt ', tokenamt)
    
            const feeRecipient = new web3.PublicKey(
                'GTwY38pfmivyecwZtevaT14N3WDHMQebrrWjt2i48E29',
            )
    
            const [S1] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from('mint-authority')],
                programId,
            )
            const [C1] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from('bonding-curve'), tokenAddress.toBuffer()],
                programId,
            )
    
            // console.log('Mint authority: ' + S.toBase58())
    
            console.log('Bonding curve: ' + C1.toBase58())
    
            const B1 = b(tokenAddress, C1, !0)
    
            const MPL_TOKEN_METADATA_PROGRAM_ID1 =
                'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' //same
    
            const E1 = new web3.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID1)
            const [O1] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from('global')],
                programId,
            )
            const [D1] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from('metadata'), E1.toBuffer(), tokenAddress.toBuffer()],
                E1,
            )
    
            let atains
    
            const r = b(tokenAddress, walletProvider.publicKey, !1)
            try {
                const res = await getAccount(connection, r)
                // console.log(res)
            } catch (error) {
                atains = Buy_createTransactionInstruction(
                    walletProvider.publicKey,
                    r,
                    walletProvider.publicKey,
                    tokenAddress,
                )
            }
    
            const { global: k } = await lx_global(programId, program)
            console.log(k)
            const {
                initialVirtualTokenReserves,
                initialVirtualSolReserves,
                initialRealTokenReserves,
                tokenTotalSupply,
                feeBasisPoints,
            } = k
    
            // Logging the specific properties
            console.log(
                'initialVirtualTokenReserves:',
                initialVirtualTokenReserves.toString(),
            )
            console.log(
                'initialVirtualSolReserves:',
                initialVirtualSolReserves.toString(),
            )
            console.log(
                'initialRealTokenReserves:',
                initialRealTokenReserves.toString(),
            )
            console.log('tokenTotalSupply:', tokenTotalSupply.toString())
            console.log('feeBasisPoints:', feeBasisPoints.toString())
            console.log('token-address', tokenAddress?.toString())
            console.log('wallet-key', walletProvider.publicKey?.toString())
    
            const EX = (e) => (k ? e.mul(new BN(0)).div(new BN(1e4)) : new BN(0))
    
            const K = (e, t) => {
                let a, r
    
                if (e.eq(new BN(0)) || !k) {
                    return new BN(0)
                }
    
                let {
                    initialVirtualSolReserves: l,
                    initialVirtualTokenReserves: s,
                    initialRealTokenReserves: o,
                } = k
    
                if (t) {
                    let t = l.mul(s)
                    let i = l.add(e)
                    let n = t.div(i).add(new BN(1))
                    r = s.sub(n)
                    r = BN.min(r, o)
                    a = e
                } else {
                    a = (e = BN.min(e, o)).mul(l).div(s.sub(e)).add(new BN(1))
                    r = e
                }
                console.log(a.toNumber())
                let i = EX(a)
                return t ? r : a.add(i)
            }
    
            // let token_amt = K(new BN(Math.floor(1e9 * parseFloat(sol_buy_amt))), !0).toNumber() / 1e6;
            let a = new BN(Math.floor(1e9 * parseFloat(buy_value)))
    
            let o = {
                solAmount: a,
            }
            console.log(
                'sol-amount',
                o.solAmount.add(
                    a.mul(new BN(Math.floor(10 * 999))).div(new BN(1e3)),
                ),
            )
    
            const buyInstruction = await program.methods
                .buy(
                    new BN(tokenamt),
                    o.solAmount.add(
                        a.mul(new BN(Math.floor(10 * 999))).div(new BN(1e3)),
                    ),
                )
                .accounts({
                    global: O1,
                    feeRecipient: feeRecipient,
                    mint: tokenAddress, // replace with you token address
                    bondingCurve: C1,
                    associatedBondingCurve: B1,
                    associatedUser: r,
                    user: walletProvider.publicKey,
                    systemProgram: new web3.PublicKey(
                        '11111111111111111111111111111111',
                    ),
                    tokenProgram: new web3.PublicKey(
                        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                    ),
                    rent: new web3.PublicKey(
                        'SysvarRent111111111111111111111111111111111',
                    ),
                })
                //.preInstructions([atains])
                .instruction()
    
            const createTokenTransaction = new web3.Transaction()
            createTokenTransaction.add(createInstruction)
            if (atains) {
                createTokenTransaction.add(atains)
            }
            createTokenTransaction.add(buyInstruction)


            createTokenTransaction.feePayer = walletProvider.publicKey;

            createTokenTransaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

            const tx = await walletProvider.signAndSendTransaction(createTokenTransaction);
            console.log("Transaction signature", tx);
            if (tx) {
                toast.success('Transaction Successful')
                return {
                    success: true,
                    token_address: token_key.publicKey.toBase58(),
                    tx_hash: tx,
                    bonding_curve: B.toBase58(),
                }
            }
    
            //setLoading(false)
            toast.success('Transaction Successful')
        } catch (err) {
            //setLoading(false)
            console.log('Error while creating coin', err)
            if (err.message.includes('User rejected the request')) {
                toast.error('Transaction request was rejected by the user.')
            } else {
                toast.error('Something went wrong. Please try again.')
            }
            return {
                success: false,
                token_address: null,
                tx_hash: null,
                bonding_curve: null,
            }
        }
    }
    
    
    // const handleLaunchToken = async (
    //     name,
    //     symbol,
    //     image,
    //     buyPercentage,
    //     tokenAmount,
    //     appconnection
    // ) => {
    //     console.log("props",name,symbol,image,buyPercentage,tokenAmount)
    //     // console.log('buyPercentage in func', buyPercentage, name, symbol, image)
    //     // if ((!name, !symbol, !image)) {
    //     //     return toast.error('Please fill out all the feilds')
    //     // }
    //     window.Buffer = buffer.Buffer
    
    //     //setLoading(true)
    
    //     try {
            
    //         // const connection = new web3.Connection(
    //         //     web3.clusterApiUrl('devnet', true),
    //         //     'confirmed',
    //         // )
    //        // console.log('connection', connection)
    
    //         const programId = new web3.PublicKey(
    //             '7jFsWYwonXMUWicDFkR7vfCudb8pm8feyzAi535DmsVh',
    //         )
    //         // const provider = new AnchorProvider(connection, walletProvider, {
    //         //     commitment: 'confirmed',
    //         // })
    //         const program = new Program(IDL1, programId, walletProvider)
    
    //        // Constants for SOL and Token decimals
    // const SOL_DECIMALS = 9;
    // const TOKEN_DECIMALS = 6;

    // // Compute scaling factors
    // const solFactor = new BN(10).pow(new BN(SOL_DECIMALS)); // 10^9 for SOL
    // const tokenFactor = new BN(10).pow(new BN(TOKEN_DECIMALS)); // 10^6 for Token

    // // Adjusted token parameters
    // const tokenTotalSupply = new BN(1000000000).mul(tokenFactor); // 1 billion tokens, adjusted for 6 decimals
    // const tokenMargin = new BN(200000000).mul(tokenFactor); // Margin adjusted for token decimals
    // const initialVirtualTokenReserves = tokenTotalSupply.add(tokenMargin);
    // const initialRealTokenReserves = tokenTotalSupply.mul(new BN(80)).div(new BN(100)); // 80% of total supply

    // const token_key = web3.Keypair.generate();
    // console.log("Token address (public key):", token_key.publicKey.toBase58());
    // console.log("SOL Decimals:", SOL_DECIMALS);
    // console.log("Token Decimals:", TOKEN_DECIMALS);
    // console.log("Initial Real Token Reserves:", initialRealTokenReserves.toString());
    // console.log("Initial Virtual Token Reserves:", initialVirtualTokenReserves.toString());

    // // Derive addresses
    // const [S] = PublicKey.findProgramAddressSync(
    //     [Buffer.from("mint-authority")],
    //     programId
    // );
    // console.log("Mint authority:", S.toBase58());

    // const [C] = PublicKey.findProgramAddressSync(
    //     [Buffer.from("bonding-curve"), token_key.publicKey.toBuffer()],
    //     programId
    // );
    // console.log("Bonding curve:", C.toBase58());

    // const B = b(token_key.publicKey, C, true);
    // console.log("Associated Bonding Curve Address:", B.toBase58());

    // const MPL_TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
    // const E = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

    // const [O] = PublicKey.findProgramAddressSync(
    //     [Buffer.from("global")],
    //     programId
    // );

    // const [D] = PublicKey.findProgramAddressSync(
    //     [Buffer.from("metadata"), E.toBuffer(), token_key.publicKey.toBuffer()],
    //     E
    // );

    // //console.log("Token Supply (adjusted for decimals):", tokenTotalSupply.toString(), max_supply * tokenFactor);
    // // Create transaction
    // const tx = await program.methods
    //     .create(
    //         name,
    //         symbol,
    //         image,
    //         100, // Adjust max_supply for token decimals
    //         initialRealTokenReserves,
    //         initialVirtualTokenReserves,
    //         tokenTotalSupply
    //     )
    //     .accounts({
    //         mint: token_key.publicKey,
    //         mintAuthority: S,
    //         bondingCurve: C,
    //         associatedBondingCurve: B,
    //         global: O,
    //         mplTokenMetadata: E,
    //         metadata: D,
    //         user: walletProvider.publicKey,  // Added user account
    //         // systemProgram: web3.SystemProgram.programId,  // Added system program
    //         // rent: web3.SYSVAR_RENT_PUBKEY,  // Added rent program
    //         // tokenProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
    //     })
    //     .signers([token_key])
    //     .instruction();

        
        
    //     tx.feePayer = walletProvider.publicKey;
    //     tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;

    // const signature = await walletProvider.signAndSendTransaction(tx,[token_key]);

    // // Placeholder for future liquidity injection logic
    // if (false) {
    //     console.log("Liquidity injection logic goes here. Inject $12,000 into Raydium.");
    // }

    // return {
    //     hash: tx,
    //     token_address: token_key.publicKey.toBase58(),
    // };
    //     } catch (err) {
    //         //setLoading(false)
    //         console.log('Error while creating coin', err)
    //         if (err.message.includes('User rejected the request')) {
    //             toast.error('Transaction request was rejected by the user.')
    //         } else {
    //             toast.error('Something went wrong. Please try again.')
    //         }
    //         return {
    //             success: false,
    //             token_address: null,
    //             tx_hash: null,
    //             bonding_curve: null,
    //         }
    //     }
    // }
    return handleLaunchToken;
};



// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export default LaunchTokenSol;

