import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    /***************** Solana Pusher *****************/
    const [notifications, setNotifications] = useState({});
    const [createNotifications, setCreateNotifications] = useState({});
    /***************** Solana Pusher *****************/

    /***************** Ethereum Pusher *****************/
    const [notificationsEth, setNotificationsEth] = useState({});
    const [createNotificationsEth, setCreateNotificationsEth] = useState({});
    /***************** Ethereum Pusher *****************/




    const [pusherThread, setPusherThread] = useState([]);
    const [pusherAfterTrade, setPusherAfterTrade] = useState();

    const [pusherLike, setPusherLike] = useState([]);
    const [pusherFollow, setPusherFollow] = useState([]);
    const [pusherNotificationThread, setPusherNotificationThread] = useState([]);




    useEffect(() => {
        // Configure Pusher client
        const pusher = new Pusher('c2c6e8d77a411d6cc315', {
            cluster: 'ap2',
        });


        // Subscribe to the channels
        /***************** Solana Pusher *****************/
        const channel = pusher.subscribe('solana-trades-channel');
        const coinChannel = pusher.subscribe('coin-created-solana');
        /***************** Solana Pusher *****************/

        /***************** Ethereum Pusher *****************/
        const channelEth = pusher.subscribe('coin-created-eth');
        const coinChannelEth = pusher.subscribe('eth-trades-channel');
        /***************** Ethereum Pusher *****************/



        const threadsChannel = pusher.subscribe('threads-channel');
        const tradeChannel = pusher.subscribe('percentage-chanel');


        const likeChannel = pusher.subscribe('like-pusher');
        const followChannel = pusher.subscribe('follow-user');
        const threadNotificationChannel = pusher.subscribe('threads-channel');
        

        // Handle coin-created event
        coinChannel.bind('coin-created-solana', (data) => {
            console.log("Coin Pusher Data Received:", data);
            setCreateNotifications({
                user_name: data.user_name,
                action: data.action,
                coin_photo: data.coin_photo,
                status: data.status,
                date: data.date,
                replies: data.replies,
                ticker: data.ticker,
                token_id: data.token_id,
                market_cap: data.market_cap,
                bonding_curve: data.bonding_curve,
                ticker: data.ticker,
                name: data.name,
                description: data.description,
            });
        });

        // Handle trade-initiated event
        channel.bind('solana-trade-initiated', (data) => {
            console.log("Trade Data Received:", data);
            setNotifications({
                user_name: data.user_name,
                action: data.action,
                coin_photo: data.coin_photo,
                token_address: data.token_address,
                user_image: data.user_image,
            });
        });
        /***************** Solana Pusher *****************/


        /***************** Ethereum Pusher *****************/
        // Handle coin-created event
        coinChannelEth.bind('coin-created-eth', (data) => {
            console.log("Coin Pusher Data Received ETH:", data);
            setCreateNotificationsEth({
                user_name: data.user_name,
                action: data.action,
                coin_photo: data.coin_photo,
                status: data.status,
                date: data.date,
                replies: data.replies,
                ticker: data.ticker,
                token_id: data.token_id,
                market_cap: data.market_cap,
                bonding_curve: data.bonding_curve,
                ticker: data.ticker,
                name: data.name,
                description: data.description,
            });
        });

        // Handle trade-initiated event
        channelEth.bind('eth-trade-initiated', (data) => {
            console.log("Trade Data Received ETH:", data);
            setNotificationsEth({
                user_name: data.user_name,
                action: data.action,
                coin_photo: data.coin_photo,
                token_address: data.token_address,
                user_image: data.user_image,
            });
        });
        /***************** Ethereum Pusher *****************/



        // Handle coin-created event
        threadsChannel.bind('new-reply', (data) => {
            console.log("threads Pusher Data Received:", data);
            setPusherThread((prevThreads) => [...prevThreads, data]);
        });

        // Handle coin-created event
        tradeChannel.bind('new-percentage', (data) => {
            console.log("pusherAfterTrade Pusher Data Received:", data);
            setPusherAfterTrade(data);
            // setPusherAfterTrade((prevTrades) => [...prevTrades, data]);
        });



        // Handle like event
        likeChannel.bind('like', (data) => {
            setPusherLike((prevLike) => [...prevLike, data]);
            console.log("like Pusher Data Received:", data);
        });
        // Handle follow event
        followChannel.bind('follow', (data) => {
            setPusherFollow((prevFollow) => [...prevFollow, data]);
            console.log("Follow Pusher Data Received:", data);
        });
        // Handle coin-created event
        threadNotificationChannel.bind('reply', (data) => {
            console.log("threads Notification Pusher Data Received:", data);
            setPusherNotificationThread((prevThreads) => [...prevThreads, data]);
        });


        // Cleanup on unmount
        return () => {
            /***************** Solana Pusher *****************/
            channel.unbind_all();
            channel.unsubscribe();
            coinChannel.unbind_all();
            coinChannel.unsubscribe();
            /***************** Solana Pusher *****************/

            /***************** Ethereum Pusher *****************/
            channelEth.unbind_all();
            channelEth.unsubscribe();
            coinChannelEth.unbind_all();
            coinChannelEth.unsubscribe();
            /***************** Ethereum Pusher *****************/


            threadsChannel.unbind_all();
            threadsChannel.unsubscribe();
            tradeChannel.unsubscribe();
            tradeChannel.unbind_all();


            /***************** Like Follow Comment Pusher *****************/
            likeChannel.unsubscribe();
            likeChannel.unbind_all();
            followChannel.unsubscribe();
            followChannel.unbind_all();
            threadNotificationChannel.unsubscribe();
            threadNotificationChannel.unbind_all();
            /***************** Like Follow Comment Pusher *****************/

        };
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            createNotifications,
            notificationsEth,
            createNotificationsEth,
            pusherThread,
            pusherAfterTrade,
            pusherLike,
            pusherFollow,
            pusherNotificationThread
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    return useContext(NotificationContext);
};
