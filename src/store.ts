import { createSlice, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    userEmail: '',
    loggedIn: !!localStorage.getItem('jwt'),
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
  },
});

const store = configureStore({
  reducer: currentUserSlice.reducer,
});

export const { setUserEmail, setLoggedIn } = currentUserSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
