import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface hotel {
    hotel_id?: number,
    user_id?: number,
    name: string,
    description: string,
    address: string,
    city: string,
    country: string,
    ammenities: string,
    star_rating: number | null,
    image_url: string

}

interface LoginState {
  info: hotel;
  hotels:hotel[]
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  info: {
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    ammenities: "",
    star_rating:null,
    image_url:""

  },
  hotels:[],
  loading: false,
  error: null,
};
export const fetchHotel = createAsyncThunk(
  "hotels/fetchHotel",
  async (_,thunkAPI) => {
    try {
       const response = await fetch('api/hotels'); 
      if (!response.ok) {
        throw new Error("Failed to get hotels");
      }

      return await response.json() as hotel[];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }
);

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (hotels:hotel,thunkAPI) => {
    try {
        const token = localStorage.getItem("token"); 
      const response = await fetch('api/hotels', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(hotels),
      });

      if (!response.ok) {
        throw new Error("Failed to add hotel");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }
);

export const editHotel = createAsyncThunk(
  "hotels/editHotel",
  async (updatedHotel: hotel, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/hotels/${updatedHotel.hotel_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedHotel),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update hotel");
      }
      return data as hotel;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const hotelSlice = createSlice({
  name: "hotels",
  initialState,

  reducers: {
    updateHotel: (
      state,action: PayloadAction<Partial<hotel>>) => {
      state.info = {...state.info,...action.payload,
      };
    },

    clearHotel: (state) => {
      state.info = {
      name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    ammenities: "",
    star_rating:null,
    image_url:""
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
        state.hotels.push(action.payload)
      })

      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })

      .addCase(fetchHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
            .addCase(editHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = state.hotels.map((item) =>
          item.hotel_id === action.payload.hotel_id ? action.payload : item
        );
      })
      .addCase(editHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const {
  updateHotel,
  clearHotel,
} = hotelSlice.actions;

export default hotelSlice.reducer;