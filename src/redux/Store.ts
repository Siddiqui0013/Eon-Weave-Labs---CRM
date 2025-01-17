import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { salesApi } from '@/services/salesApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [salesApi.reducerPath]: salesApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    salesApi.middleware
  )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
