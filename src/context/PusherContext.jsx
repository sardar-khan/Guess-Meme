import React, { createContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export const PusherContext = createContext();

const PusherProvider = ({ children }) => {
    const [data, setData] = useState([]);
    console.log("datasssssssssssssssss:", data)

    useEffect(() => {
        // Initialize Pusher
        const pusher = new Pusher('1859723', {
            cluster: 'ap2',
        });

        // Subscribe to channel
        const channel = pusher.subscribe('coin-created-channel'); // Replace with your channel name
        channel.bind('coin-created', (newData) => {
            console.log('Received data:', newData);
            setData((prevData) => [...prevData, newData]); // Update state
        });

        // Cleanup
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    return (
        <PusherContext.Provider value={{ data }}>
            {children}
        </PusherContext.Provider>
    );
};

export default PusherProvider;
