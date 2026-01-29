import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IOrder } from "@/models/order.model";

// Define a type for the slice state
export interface OrderState {
  allOrdersData: IOrder[];
}

// Define the initial state using that type
const initialState: OrderState = {
  allOrdersData: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setAllOrdersData: (state, action: PayloadAction<IOrder[]>) => {
      state.allOrdersData = action.payload;
    },
  },
});

export const { setAllOrdersData } = orderSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllOrdersData = (state: RootState) =>
  state.order.allOrdersData;
export default orderSlice.reducer;
