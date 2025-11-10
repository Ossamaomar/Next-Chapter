import {
  checkUserHasCart,
  deleteCart,
  deleteCartItem,
} from "@/app/_services/cart";
import { CartItem, CartState } from "@/app/_services/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState: CartState = {
  id: "",
  studentId: "",
  createdAt: "",
  userHasCart: false,
  cartItems: [],
  previousCartItems: [],
};

export const deleteItemThunk = createAsyncThunk(
  "cart/deleteItem",
  async (id: string) => {
    // const cart = (getState() as RootState).cart;
    await deleteCartItem(id);
    return id;
  }
);

export const deleteCartThunk = createAsyncThunk(
  "cart/deleteCart",
  async (id: string) => {
    const cart = await checkUserHasCart(id, "student");
    console.log(cart);
    await deleteCart(cart.cart.id, cart.cartItems);
    return cart;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCourseToCartSlice(state, action: PayloadAction<CartItem>) {
      state.cartItems.push(action.payload);
    },
    createCartSlice(state, action: PayloadAction<CartState>) {
      state.id = action.payload.id;
      state.createdAt = action.payload.createdAt;
      state.studentId = action.payload.studentId;
      state.userHasCart = action.payload.userHasCart;
      state.cartItems = action.payload.cartItems;
      state.previousCartItems = action.payload.cartItems;
    },
    deleteCartSlice() {
      return initialState;
    },
    deleteCartItemFromSlice(state, action: PayloadAction<CartItem>) {
      state.previousCartItems = [...state.cartItems];
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearCartSlice() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteItemThunk.rejected, (state) => {
        state.cartItems = state.previousCartItems;
      })
      .addCase(deleteItemThunk.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const {
  addCourseToCartSlice,
  createCartSlice,
  deleteCartItemFromSlice,
  deleteCartSlice,
  clearCartSlice
} = cartSlice.actions;

export const getCartState = (state: { cart: CartState }) => state.cart;
export const getCartId = (state: { cart: CartState }) => state.cart.id;
export const getCartItems = (state: RootState) => state.cart.cartItems;
export default cartSlice.reducer;
