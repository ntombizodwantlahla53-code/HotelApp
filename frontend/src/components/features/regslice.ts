import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

export interface reg {
  id?: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterState {
  info: reg;
  loading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  info: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  loading: false,
  error: null,
};

export const fetchRegs = createAsyncThunk(
  "regs/fetchRegs",
  async (register:reg,thunkAPI) => {
    try {
      const response = await fetch('api/auth/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
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

export const registerSlice = createSlice({
  name: "register",
  initialState,

  reducers: {
    updateRegister: (
      state,action: PayloadAction<Partial<reg>>) => {
      state.info = {...state.info,...action.payload,
      };
    },

    clearRegister: (state) => {
      state.info = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRegs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRegs.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(fetchRegs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateRegister,
  clearRegister,
} = registerSlice.actions;

export default registerSlice.reducer;