import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     isLoggedIn: false,
//     userInfo: null,
// };

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        userInfo: null, // Sẽ chứa roleId ở đây
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.userInfo = action.payload; // payload bao gồm email, roleId...
        },
        processLogout: (state) => {
            state.isLoggedIn = false;
            state.userInfo = null;
        },
    },
});

export const { loginSuccess, processLogout } = userSlice.actions;
export default userSlice.reducer;