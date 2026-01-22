import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.userInfo = action.payload; // Lưu thông tin user từ backend trả về
        },
        processLogout: (state) => {
            state.isLoggedIn = false;
            state.userInfo = null;
        },
    },
});

export const { loginSuccess, processLogout } = userSlice.actions;
export default userSlice.reducer;