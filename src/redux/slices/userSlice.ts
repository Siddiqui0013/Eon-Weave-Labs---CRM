import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  role: string; 
}

const initialState: UserState = {
  role: "", 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload; 
    },
  },
});

export const { setRole } = userSlice.actions;
export default userSlice.reducer;







// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface UserState {
//   role: 'CEO' | 'HR' | 'Developer' | 'BDO' | null;
//   isAuthenticated: boolean;
// }

// const initialState: UserState = {
//   role: null,
//   isAuthenticated: false,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setRole: (state, action: PayloadAction<UserState['role']>) => {
//       state.role = action.payload;
//     },
//     authenticate: (state) => {
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.role = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setRole, authenticate, logout } = userSlice.actions;
// export default userSlice.reducer;
