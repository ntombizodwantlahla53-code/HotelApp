import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface PaymentState {
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
};

export const payBooking = createAsyncThunk(
  "payments/payBooking",
  async (booking_id: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/bookings/${booking_id}/pay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(payBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payBooking.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(payBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;