// src/store/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { viewProfile, editProfile } from '../utils/api';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
    const response = await viewProfile();
    console.log("fetchProfile", response)
    return response.data;
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (profile) => {
    const response = await editProfile(profile);
    console.log("updateProfile", response)
    return response;
});

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        username: '',
        profilePhoto: '',
        bio: '',
        trustScore: '',
        createdAt: '',
        loading: false,
        error: null,
    },
    reducers: {
        setProfile: (state, action) => {
            const { username, bio, profilePhoto, trustScore,createdAt } = action.payload;
            state.username = username;
            state.bio = bio;
            state.profilePhoto = profilePhoto;
            state.trustScore = trustScore;
            state.createdAt = createdAt;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.username = action.payload.user_name;
                state.bio = action.payload.bio;
                state.profilePhoto = action.payload.profile_photo;
                state.trustScore = action.payload.trust_score;
                state.createdAt = action.payload.createdAt;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.username = action.payload.user_name;
                state.bio = action.payload.bio;
                state.profilePhoto = action.payload.profile_photo;
                state.trustScore = action.payload.trust_score;
                state.createdAt = action.payload.createdAt;
            });
    },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
