import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  cnic: string;
  address: string;
  jobTitle: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  accessToken: "",
  refreshToken: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuthenticated = false;
    }
  },
});

export const { setUserData, logout } = userSlice.actions;
export default userSlice.reducer;




// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface UserState {
//   role: string; 
// }

// const initialState: UserState = {
//   role: "", 
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setRole: (state, action: PayloadAction<string>) => {
//       state.role = action.payload; 
//     },
//   },
// });

// export const { setRole } = userSlice.actions;
// export default userSlice.reducer;

