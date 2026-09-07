import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('naikUser') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, loading: false, error: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('naikUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('naikUser');
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
