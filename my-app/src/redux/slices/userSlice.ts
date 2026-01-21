import { IUser } from "@/models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface UserState {
  userData: IUser | null;
}

// Define the initial state using that type
const initialState: UserState = {
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUser>) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserData = (state: UserState) => state.userData;
export default userSlice.reducer;
