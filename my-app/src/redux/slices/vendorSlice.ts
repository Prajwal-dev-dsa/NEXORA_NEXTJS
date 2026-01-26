import { IUser } from "@/models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IProduct } from "@/models/product.model";

// Define a type for the slice state
export interface VendorState {
  allVendorsData: IUser[];
  allProductsData: IProduct[];
}

// Define the initial state using that type
const initialState: VendorState = {
  allVendorsData: [],
  allProductsData: [],
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setAllVendorsData: (state, action: PayloadAction<IUser[]>) => {
      state.allVendorsData = action.payload;
    },
    setAllProductsData: (state, action: PayloadAction<IProduct[]>) => {
      state.allProductsData = action.payload;
    },
  },
});

export const { setAllVendorsData, setAllProductsData } = vendorSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllVendorsData = (state: RootState) =>
  state.vendor.allVendorsData;
export const selectAllProductsData = (state: RootState) =>
  state.vendor.allProductsData;
export default vendorSlice.reducer;
