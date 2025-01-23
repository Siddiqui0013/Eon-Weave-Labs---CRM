import { configureStore } from '@reduxjs/toolkit';
import { UserApi } from '@/services/userApi';
import { MeetingApi } from '@/services/meetingApi';
import { SalesApi } from '@/services/salesApi';
import { CallsApi } from '@/services/callsApi';

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [MeetingApi.reducerPath]: MeetingApi.reducer,
    [SalesApi.reducerPath]: SalesApi.reducer,
    [CallsApi.reducerPath]: CallsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      UserApi.middleware,
      MeetingApi.middleware,
      SalesApi.middleware,
      CallsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
