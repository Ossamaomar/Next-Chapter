import { WishlistItem, WishlistState } from "@/app/_services/types";
import { deleteWishlistItem } from "@/app/_services/wishlist";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: WishlistState = {
  id: "",
  studentId: "",
  createdAt: "",
  userHasWishlist: false,
  wishlistItems: [],
  previousWishlistItems: [],
};

export const deleteWishlistItemThunk = createAsyncThunk(
  "wishlist/deleteItem",
  async (id: string) => {
    // const cart = (getState() as RootState).cart;
    await deleteWishlistItem(id);
    return id;
  }
);

const wishlistSlice = createSlice({
  initialState,
  name: "wishlist",
  reducers: {
    createWishlistSlice(state, action: PayloadAction<WishlistState>) {
      state.id = action.payload.id;
      state.createdAt = action.payload.createdAt;
      state.studentId = action.payload.studentId;
      state.userHasWishlist = action.payload.userHasWishlist;
      state.wishlistItems = action.payload.wishlistItems;
      state.previousWishlistItems = action.payload.previousWishlistItems;
    },
    deleteWishlistSlice() {
      return initialState;
    },
    addCourseToWishlistSlice(state, action: PayloadAction<WishlistItem>) {
      state.wishlistItems.push(action.payload);
    },
    deleteWishlistItemFromSlice(state, action: PayloadAction<WishlistItem>) {
      state.previousWishlistItems = [...state.wishlistItems];
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearWishlistSlice() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteWishlistItemThunk.rejected, (state) => {
        state.wishlistItems = state.previousWishlistItems;
      })
      .addCase(deleteWishlistItemThunk.fulfilled, (state, action) => {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const {
  createWishlistSlice,
  deleteWishlistSlice,
  addCourseToWishlistSlice,
  deleteWishlistItemFromSlice,
  clearWishlistSlice
} = wishlistSlice.actions;

export const getWishlistState = (state: { wishlist: WishlistState }) =>
  state.wishlist;
export const getWishlistItemsState = (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlistItems;

export default wishlistSlice.reducer;
