import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Mặc định là localStorage
import userReducer from './slices/userSlice';

const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['isLoggedIn', 'userInfo'] // Chỉ lưu 2 trường này khi reload
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  // Fix lỗi non-serializable value của Redux Toolkit
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;