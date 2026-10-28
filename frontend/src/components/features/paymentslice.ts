import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface PaymentState {
  loading: boolean;
  error: string | null;
  paid: boolean;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  paid: false,
};

export const startPayment = createAsyncThunk(
  "payments/startPayment",
  async (booking_id: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/bookings/${booking_id}/pay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not start payment");
      }
      return data.payment_url as string;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payments/verifyPayment",
  async (reference: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/payments/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment check failed");
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
      .addCase(startPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(startPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paid = false;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.paid = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;