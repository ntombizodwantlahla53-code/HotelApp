import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { room } from "./roomslice";

export interface booking {
  booking_id?: number;
  room_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  nights?: number;
  total_price?: number;
}

interface BookingState {
  info: booking;
  room: room | null;
  bookings: booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  info: {
    room_id: 0,
    check_in: "",
    check_out: "",
    guests: 1,
  },
  room: null,
  bookings: [],
  loading: false,
  error: null,
};

export const fetchBookingRoom = createAsyncThunk(
  "bookings/fetchBookingRoom",
  async (room_id: number, thunkAPI) => {
    try {
      const response = await fetch(`/api/rooms/${room_id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get room");
      }
      return data as room;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const addBookings = createAsyncThunk(
  "bookings/addBookings",
  async (newBooking: booking, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBooking),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to make booking");
      }
      return data as booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const bookingSlice = createSlice({
  name: "bookings",
  initialState,

  reducers: {
    updateBooking: (state, action: PayloadAction<Partial<booking>>) => {
      state.info = { ...state.info, ...action.payload };
    },
    clearBooking: (state) => {
      state.info = {
        room_id: 0,
        check_in: "",
        check_out: "",
        guests: 1,
      };
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(addBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookingRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.room = null;
      })
      .addCase(fetchBookingRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.room = action.payload;
      })
      .addCase(fetchBookingRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const {updateBooking,clearBooking,} = bookingSlice.actions;
export default bookingSlice.reducer;