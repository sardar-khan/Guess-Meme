import { toast } from 'react-toastify';
import { parseEther } from 'viem';
import { adminTokenAddress } from '../../utils/api';
import { LaunchTokenEthValue } from '../../services/config';


const LaunchTokenPolygon = (address, sendTransaction, balance, amount) => {
    console.log("poly amount", amount, LaunchTokenEthValue);

    const amountParse = parseFloat(amount)
    const TokenEthValue = parseFloat(LaunchTokenEthValue)

    const AMOUNT_TO_SEND = amount === undefined || null ? TokenEthValue : amountParse + TokenEthValue;
    console.log("AMOUNT_TO_SEND", AMOUNT_TO_SEND)


    return async () => {
        try {
            const adminAddress = await adminTokenAddress();

            if (!adminAddress?.address) {
                toast.error("Something went wrong, please try again!");
                return false;
            }

            const userBalance = balance ? parseFloat(balance) : 0;
            console.log("userBalance", userBalance)
            // if (userBalance < 0.05) {
            if (userBalance < AMOUNT_TO_SEND) {
                toast.error("Insufficient balance in wallet!");
                return false;
            }

            const txResponse = await sendTransaction({
                to: adminAddress.address,
                value: parseEther(AMOUNT_TO_SEND.toString()),
                // value: parseEther("0.05"),
            });
            console.log("txt-respnse", txResponse);
            // toast.info('Buying Token')
            if (txResponse) {
                // toast.dismiss()
                toast.success("Transaction Successful!");
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error while transferring ETH:", error);
            toast.error(`Transaction Error: ${error.message}`);
            return false;
        }
    };
};

export default LaunchTokenPolygon;