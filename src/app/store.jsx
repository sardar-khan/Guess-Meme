// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../features/profileSlice';
import coinReducer from '../features/coinSlice';
import animationReducer from '../features/animationSlice';
import tradesReducer from '../features/tradesSlice';

const store = configureStore({
    reducer: {
        profile: profileReducer,
        coins: coinReducer,
        animation: animationReducer,
        trades: tradesReducer,
    },
});

export default store;
