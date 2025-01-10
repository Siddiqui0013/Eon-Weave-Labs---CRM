import { createSlice } from '@reduxjs/toolkit';

interface NavbarState {
  links: { key: string; label: string; path: string }[];
}

const initialState: NavbarState = {
  links: [],
};

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setLinks: (state, action) => {
      state.links = action.payload;
    },
  },
});

export const { setLinks } = navbarSlice.actions;
export default navbarSlice.reducer;
