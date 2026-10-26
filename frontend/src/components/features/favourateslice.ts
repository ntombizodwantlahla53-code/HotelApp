import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { hotel } from "./hotelslice";

interface FavouriteState {
  favourites: hotel[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouriteState = {
  favourites: [],
  loading: false,
  error: null,
};

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get favourites");
      }

      return data as hotel[];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const addFavourites = createAsyncThunk(
  "favourites/addFavourites",
  async (hotel_id: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hotel_id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add favourite");
      }

      return data as hotel;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const deleteFavourites = createAsyncThunk(
  "favourites/deleteFavourites",
  async (hotel_id: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/favourites/${hotel_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove favourite");
      }

      return hotel_id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const favouriteSlice = createSlice({
  name: "favourites",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavourites.fulfilled, (state, action) => {
        if (!state.favourites.some((h) => h.hotel_id === action.payload.hotel_id)) {
          state.favourites.push(action.payload);
        }
      })
      .addCase(addFavourites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteFavourites.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(
          (h) => h.hotel_id !== action.payload
        );
      })
      .addCase(deleteFavourites.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default favouriteSlice.reducer;