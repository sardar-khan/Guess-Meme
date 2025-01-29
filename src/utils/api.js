// utils/api.js
import axios from 'axios';
import { toast } from 'react-toastify';
import SecureLS from 'secure-ls';

// Initialize SecureLS
const ls = new SecureLS({ encodingType: 'aes' });
const apiUrl = import.meta.env.VITE_API_URL;
const blockchain = localStorage.getItem("blockchain")
// const checkBlockChain = blockchain == "SOL"  ? 'solana' : 'ethereum'
// const checkBlockChain = blockchain === 'SOL' ? 'solana' : blockchain === 'ETH' ? 'ethereum' : 'solana';
// const checkBlockChain = blockchain === 'SOL' ? 'solana' : blockchain === 'ETH' ? 'ethereum' : blockchain === null ? 'solana' : 'solana';
// const checkBlockChain = blockchain === 'SOL' ? 'solana' : blockchain === 'ETH' ? 'ethereum' : blockchain === null ? 'solana' : 'solana';

const checkBlockChain =
    blockchain === 'SOL' ? 'solana' :
        blockchain === 'ETH' ? 'ethereum' :
            blockchain === 'POL' ? 'polygon' :
                blockchain === 'BNB' ? 'bsc' :
                    blockchain === null ? 'solana' :
                        'solana';

console.log("blockchainssss", blockchain)
const apiInstance = axios.create({
    baseURL: apiUrl,
});

// Interceptor to attach the token in headers for every request
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// handleSignUp function
export const handleSignUp = async (address, blockchain) => {
    try {
        const response = await apiInstance.post('user/register', {
            address,
            blockchain,
        });
        const token = response.data.data.token;

        if (token) {
            localStorage.setItem('token', token);
        }

        return response.data;
    } catch (error) {
        console.error('Error posting wallet address:', error);
        toast.error('Failed to send wallet address.', { autoClose: 1000 });
    }
};

// viewProfile function
export const viewProfile = async () => {
    try {
        const response = await apiInstance.get('user/view-profile');
        console.log('viewProfile', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// editProfile function
export const editProfile = async ({ user_name, bio, profile_photo }) => {
    try {
        const response = await apiInstance.post('user/edit-profile', {
            user_name,
            bio,
            profile_photo,
        });
       // console.log('editProfile', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during edit Profile:', error);
        throw error;
    }
};

// viewCoins function
export const viewCoins = async ({sortBy,coinSorting}) => {
    try {
        
        const url = sortBy ? `user/view-coins?status=${sortBy?.toLowerCase()}&type=${checkBlockChain}&sortBy=${coinSorting?.toLowerCase()}` : `user/view-coins?status=deployed&type=${checkBlockChain}`;
        const response = await apiInstance.get(url);
        
        return response.data;
    } catch (error) {
        console.error('Error fetching coins:', error);
        throw error;
    }
};

export const kingoftheHill_progress = async (token_address) => {
    try {
        const response = await apiInstance.post('trade/king-of-hill-progress', {
            token_address: token_address
        });
       // console.log('kingoftheHill_progress', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during kingoftheHill_progress:', error);
        throw error;
    }
};


export const Progress_curve_bond = async (token_address) => {
    try {
        const response = await apiInstance.post('trade/progress-curve-bond', {
            token_address: token_address
        });
        console.log('Progress_curve_bondssss', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during Progress_curve_bond:', error);
        throw error;
    }
};


//createCoin function
export const createCoin = async ({ name, ticker, description, image, max_supply, twitter_link, telegram_link, website, bonding_curve, max_buy_percentage, amount, timer, hash, bondingCurve, tokenAddress }) => {
    try {
        const response = await apiInstance.post('user/create-coin', {
            name,
            ticker,
            description,
            image,
            max_supply,
            twitter_link,
            telegram_link,
            website,
            bonding_curve,
            max_buy_percentage,
            amount,
            timer,
            hash,
            bonding_curve: bondingCurve,
            token_address: tokenAddress,
        });

        console.log('createCoin', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during createCoin:', error);
        throw error;
    }
};


// Function to upload the image
export const uploadImage = async (formData) => {
    try {
        const response = await apiInstance.post('getimageurl', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.log("errorerrorerrorerror", error)
        throw new Error(error.response?.data?.message || 'Image upload failed');
    }
};


// Submit comment function using Axios instance
export const submitComment = async ({ text, token_id, reply_id, image }) => {
    try {
        const response = await apiInstance.post('thread/post', {
            text,
            token_id,
            reply_id,
            image,
        });
        console.log('submitComment', response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to post comment');
    }
};

// Submit comment function using Axios instance
export const BuyToken = async ({ account_type, amount, token_amount, token_id, type, transaction_hash }) => {
    try {
        const response = await apiInstance.post('trade/initiate', {
            account_type,
            amount,
            token_amount,
            token_id,
            type,
            transaction_hash,
        });
        console.log('BuyToken', response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to Buy Token');
    }
};



// KingOfTheHill function
export const KingOfTheHill = async () => {
    try {
        const response = await apiInstance.get(`trade/coin_of_hill/${checkBlockChain}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile :', error);
        throw error;
    }
};


// ViewUser
export const ViewUser = async (userId) => {
    try {
        const response = await apiInstance.get(`/user/user-profile`, {
            params: { user_id: userId },
        });
        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};



// Fetch top holders data by token address
export const getTopHolders = async (tokenAddress) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}user/top-holders`, {
        token_address: tokenAddress,
    });
    if (response.data.status === 200) {
        return response.data.data;
    } else {
        throw new Error("Failed to fetch top holders");
    }
};



// ViewCoin
export const viewCoin = async (coinId) => {
    try {
        const response = await apiInstance.post(`user/view-token/${coinId} `);
        console.log("coinId", coinId)
        console.log("responseData", response.data)
        return response.data;
    } catch (error) {
        console.error('Error in View Coin:', error);
        throw error;
    }
};
export const getCoinByWalletAddress = async (coinId) => {
    try {
        const response = await apiInstance.post(`user/token-details/${coinId} `);
        console.log("coinId", coinId)
        console.log("responseData", response.data)
        return response.data;
    } catch (error) {
        console.error('Error in View Coin:', error);
        throw error;
    }
};




// Top Three Coins
// http://localhost:5000/user/top-three-coins/ethereum
export const topThreeCoins = async () => {
    try {
        const response = await apiInstance.get(`/user/top-three-coins/${checkBlockChain}`);
        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};


// http://localhost:5000/admin/admin-addresses/ethereum
export const adminTokenAddress = async () => {
    try {
        const response = await apiInstance.get(`/admin/admin-addresses/${checkBlockChain}`);
        console.log("adminTokenAddress", response.data)
        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};


// http://localhost:5000/user/view-profile
export const viewUserprofile = async () => {
    try {
        const response = await apiInstance.get(`/user/view-profile`);
        console.log("viewUserprofile", response.data)
        return response.data;
    } catch (error) {
        console.error('Error in ViewUser:', error);
        throw error;
    }
};


export const CheckFollow = async (id) => {
    try {
        const response = await apiInstance.post('user/check-follow', {
            user_id: id
        });
        console.log('CheckFollow', response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};



export const toggleFollow = async (id) => {
    try {
        const response = await apiInstance.post('user/toggle-follow', {
            user_id: id
        });
        console.log('toggleFollow', response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const toggleLike = async (thread_id) => {
    try {
        const response = await apiInstance.post('thread/toggle-like', {
            thread_id: thread_id,
        });
        console.log('toggleLike', response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const checkLikeStatus = async (thread_id) => {
    try {
        const response = await apiInstance.post('thread/check-like-status', {
            thread_id: thread_id,
        });
        console.log('toggleLike', response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getNotifications = async () => {
    try {
        const response = await apiInstance.get(`/user/notifications`);
        return response.data;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw error;
    }
};


export const resetNotificationsCount = async () => {
    try {
        const response = await apiInstance.get(`/user/reset-notification-count`);
        return response.data;
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw error;
    }
};


// http://localhost:5000/trade/lastest-data
export const getLatestNotifications = async () => {
    try {
        const response = await apiInstance.get(`/trade/lastest-data`);
        return response.data;
    } catch (error) {
        console.error('Error getting latest notifications:', error);
        throw error;
    }
};
