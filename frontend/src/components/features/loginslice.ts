import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface log {
  id?: number;
  name: string;
  email: string;
  password: string;
}

interface LoginState {
  info: log;
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  info: {
    name: "",
    email: "",
    password: "",
  },
  loading: false,
  error: null,
};

export const fetchLogs = createAsyncThunk(
  "logs/fetchLogs",
  async (login:log,thunkAPI) => {
    try {
      const response = await fetch('api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
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

export const loginSlice = createSlice({
  name: "login",
  initialState,

  reducers: {
    updateLogin: (
      state,action: PayloadAction<Partial<log>>) => {
      state.info = {...state.info,...action.payload,
      };
    },

    clearLogin: (state) => {
      state.info = {
        name: "",
        email: "",
        password: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLogs.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateLogin,
  clearLogin,
} = loginSlice.actions;

export default loginSlice.reducer;