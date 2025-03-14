import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    user: any;
    accessToken: string | null;
    isAuthenticated: boolean;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    refreshToken: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.refreshToken = action.payload.refreshToken;
        },
        logoutUser: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.refreshToken = null;
        },
    },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;