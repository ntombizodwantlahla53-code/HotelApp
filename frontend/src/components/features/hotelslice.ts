import {createSlice,createAsyncThunk,} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Addhotels {
hotel_id: number,
    user_id: number,
    name: string,
    description: string,
    address: string,
    city: string,
    country: string,
    ammenities: string,
    star_rating: number | null,
    created_at: number,
    updated_at: number

}
interface addhotel {
  details:{
 user_id: number,
    name: string,
    description: string,
    address: string,
    city: string,
    country: string,
    ammenities: string,
    star_rating: number | null,
  };
  links: Addhotels[]; //all fetched list are here
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortBy: "az"| "za"| "newest" | "oldest";
}
const initialState: addhotel = {
  details:{
user_id: 0,
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    ammenities: "",
    star_rating: null
  },
  links: [],
  loading: false,
  error: null,
  searchTerm: "",
  sortBy: "newest",
};
export const fetchHotel = createAsyncThunk("hotel/fetchHotel",async (addhotels: Addhotels,thunkAPI) => {
    try {
      const response = await fetch('api/hotels',{
          method: "POST",
          headers: {"Content-Type":"application/json",},
          body: JSON.stringify(addhotels),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add hotel");
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message: "Something went wrong"
      );
    }
  }
);
export const fetchHotels = createAsyncThunk("hotel/fetchHotels", async (user_id: number,thunkAPI) => {
    try {
      const response = await fetch(`api/hotels`);
      if (!response.ok) {
        throw new Error("Failed to get hotels");
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message: "Failed to get hotels"
      );
    }
  }
);

export const addhotelsSlice = createSlice({
  name: "addhotels",
  initialState,
  reducers: {
    hotels: (state, action: PayloadAction<Partial<addhotel["details"]>>) => {
      state.details = {...state.details,...action.payload,};
    },
    
    clearHotels: (state) => {
      state.links = [];
      state.details = {
        user_id: 0,
        name: "",
        description: "",
        address: "",
        city: "",
        country: "",
        ammenities: "",
        star_rating: null,
      };
    },
    setSearchTerm:(state,action: PayloadAction<string>) => {
      state.searchTerm=action.payload;
    },
    setSortBy:(state,action: PayloadAction<"az"| "za"| "newest" | "oldest">) => {
      state.sortBy=action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchHotel.pending,(state) => {
          state.loading = true;
          state.error = null;
        })
      .addCase(fetchHotel.fulfilled,(state, action) => {
          state.loading = false;
          state.links.push(action.payload);
          state.details = {
            user_id: 0,
            name: "",
            description: "",
            address: "",
            city: "",
            country: "",
            ammenities: "",
            star_rating: null,
          };
        })
      .addCase(fetchHotel.rejected,(state, action) => {
          state.loading = false;
          state.error =action.payload as string;
        })
      .addCase(fetchHotels.pending,(state) => {
          state.loading = true;
          state.error = null;
        })
      .addCase(fetchHotels.fulfilled,(state, action) => {
          state.loading = false;
          state.links =action.payload;
        })
      .addCase(fetchHotels.rejected,(state, action) => {
          state.loading = false;
          state.error =action.payload as string;
        })
    }
});
export const {hotels,clearHotels,setSearchTerm, setSortBy} = addhotelsSlice.actions;
export default addhotelsSlice.reducer;