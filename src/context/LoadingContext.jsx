// utils/LoadingContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context for loading state
const LoadingContext = createContext();

// Custom hook to use the loading context
export const useLoading = () => {
    return useContext(LoadingContext);
};

// Provider component
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State for button disable

    const toggleLoading = (state) => {
        setLoading(state);
    };

    const disableButtonTemporarily = (duration = 2000) => {
        setIsButtonDisabled(true); // Disable the button
        setTimeout(() => {
            setIsButtonDisabled(false); // Enable it after the duration
        }, duration);
    };

    return (
        <LoadingContext.Provider value={{ loading, setLoading, toggleLoading, isButtonDisabled, disableButtonTemporarily }}>
            {children}
        </LoadingContext.Provider>
    );
};
