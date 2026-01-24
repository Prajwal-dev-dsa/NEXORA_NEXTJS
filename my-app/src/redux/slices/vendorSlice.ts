import { IUser } from "@/models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
export interface VendorState {
  allVendorsData: IUser[];
}

// Define the initial state using that type
const initialState: VendorState = {
  allVendorsData: [],
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setAllVendorsData: (state, action: PayloadAction<IUser[]>) => {
      state.allVendorsData = action.payload;
    },
  },
});

export const { setAllVendorsData } = vendorSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllVendorsData = (state: RootState) =>
  state.vendor.allVendorsData;
export default vendorSlice.reducer;
