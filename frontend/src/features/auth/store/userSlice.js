import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        userInfo: null,
        token: null
    },
    reducers: {
        // Accept either { user, token } (preferred) or a bare user (legacy).
        loginSuccess: (state, action) => {
            const payload = action.payload || {};
            const isWrapped = payload && typeof payload === 'object' && 'user' in payload;
            state.isLoggedIn = true;
            state.userInfo = isWrapped ? payload.user : payload;
            state.token = isWrapped ? (payload.token || null) : null;
        },
        processLogout: (state) => {
            state.isLoggedIn = false;
            state.userInfo = null;
            state.token = null;
        }
    }
});

export const { loginSuccess, processLogout } = userSlice.actions;
export default userSlice.reducer;
