import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchProducts, Product } from "./vendingMachineAPI";

export interface VendingMachineState {
  products: Product[];
  insertedMoney: number;
  change: number[][];
  selectedProduct: Product | null;
}

const initialState: VendingMachineState = {
  products: [],
  insertedMoney: 0,
  change: [],
  selectedProduct: null,
};

export const getProducts = createAsyncThunk(
  "vendingMachine/fetchProducts",
  async () => await fetchProducts()
);

export const vendingMachineSlice = createSlice({
  name: "vendingMachine",
  initialState,
  reducers: {
    insertMoney: (state, action: PayloadAction<number>) => {
      state.insertedMoney += action.payload;
    },
    selectProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
      state.insertedMoney = initialState.insertedMoney;
    },
    setChange: (state, action: PayloadAction<number[][]>) => {
      state.change = action.payload;
    },
    takeProduct: (state) => {
      state.change = initialState.change;
      state.insertedMoney = initialState.insertedMoney;
      state.selectedProduct = initialState.selectedProduct;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export const selectProducts = (state: RootState) =>
  state.vendingMachine.products;
export const selectChange = (state: RootState) => state.vendingMachine.change;
export const selectSelectedProduct = (state: RootState) =>
  state.vendingMachine.selectedProduct;
export const selectInsertedMoney = (state: RootState) =>
  state.vendingMachine.insertedMoney;
export const { insertMoney, setChange, selectProduct, takeProduct } =
  vendingMachineSlice.actions;

export default vendingMachineSlice.reducer;
