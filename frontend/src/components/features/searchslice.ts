import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { hotel } from "./hotelslice";

export interface search {
  check_in: string;
  check_out: string;
  hotel_name:string
}

interface SearchState {
  info: search;
  results: hotel[];
  searched: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  info: {
    check_in: "",
    check_out: "",
    hotel_name:""
  },
  results: [],
  searched: false,
  loading: false,
  error: null,
};

export const fetchAvailable = createAsyncThunk(
  "search/fetchAvailable",
  async (info: search, thunkAPI) => {
    try {
      const response = await fetch(`/api/hotels/available?check_in=${info.check_in}&check_out=${info.check_out}&hotel_name=${encodeURIComponent(info.hotel_name)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to search hotels");
      }
      return data as hotel[];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState,

  reducers: {
    updateSearch: (state, action: PayloadAction<Partial<search>>) => {
      state.info = { ...state.info, ...action.payload };
    },

    clearSearch: (state) => {
      state.info = {
        check_in: "",
        check_out: "",
        hotel_name:""
      };
      state.results = [];
      state.searched = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailable.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searched = true;
      })
      .addCase(fetchAvailable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateSearch,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;