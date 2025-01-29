import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOn: true // Default to "On"
};

const animationSlice = createSlice({
    name: 'animation',
    initialState,
    reducers: {
        toggleAnimation: (state) => {
            state.isOn = !state.isOn;
        }
    }
});

export const { toggleAnimation } = animationSlice.actions;
export default animationSlice.reducer;
