import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { MeetingApi } from '@/services/meetingApi';
import { SalesApi } from '@/services/salesApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [MeetingApi.reducerPath]: MeetingApi.reducer,
    [SalesApi.reducerPath]: SalesApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      MeetingApi.middleware,
      SalesApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
