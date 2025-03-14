import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { UserApi } from '@/services/userApi';
import { MeetingApi } from '@/services/meetingApi';
import { SalesApi } from '@/services/salesApi';
import { CallsApi } from '@/services/callsApi';
import { ChatApi } from '@/services/chatAPI';
import { EmployeeWorksheetApi } from '@/services/EmployeeWorksheetApi';
import chatReducer from './slices/chatSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [MeetingApi.reducerPath]: MeetingApi.reducer,
    [SalesApi.reducerPath]: SalesApi.reducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
    chat: chatReducer,
    auth: authReducer,
    [CallsApi.reducerPath]: CallsApi.reducer,
    [EmployeeWorksheetApi.reducerPath]: EmployeeWorksheetApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      UserApi.middleware,
      MeetingApi.middleware,
      SalesApi.middleware,
      CallsApi.middleware,
      EmployeeWorksheetApi.middleware,
      ChatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
