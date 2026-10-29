import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface reservation {
  booking_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  total_price: number;
  payment_status: string;
  booking_status: string;
  user_name: string;
  user_email: string;
  room_description: string;
  hotel_name: string;
  number_of_rooms: number;
}

interface ReservationState {
  reservations: reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

const callApi = async (url: string, method: string, body?: object) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method,
    headers: {"Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const fetchReservations = createAsyncThunk(
  "reservations/fetchReservations",
  async (_, thunkAPI) => {
    try {
      return (await callApi("/api/reservations", "GET")) as reservation[];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const changeStatus = createAsyncThunk(
  "reservations/changeStatus",
  async (info: { booking_id: number; booking_status: string }, thunkAPI) => {
    try {
      return await callApi(`/api/reservations/${info.booking_id}/status`, "PATCH", {
        booking_status: info.booking_status,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const modifyReservation = createAsyncThunk(
  "reservations/modifyReservation",
  async (info: { booking_id: number; check_in: string; check_out: string; guests: number }, thunkAPI) => {
    try {
      return await callApi(`/api/reservations/${info.booking_id}`, "PUT", {
        check_in: info.check_in,
        check_out: info.check_out,
        guests: info.guests,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(modifyReservation.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});
export default reservationSlice.reducer;