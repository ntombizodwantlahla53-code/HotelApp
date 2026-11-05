import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface user {
  id: number;
  name: string;
  email: string;
  role: string;
}
export interface adminForm {
  name: string;
  email: string;
  password: string;
}
const emptyAdminForm: adminForm = { name: "", email: "", password: "" };
interface UserState {
  users: user[];
  loading: boolean;
  error: string | null;
  adminForm: adminForm;
  adminLoading: boolean;
  adminError: string | null;
}
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  adminForm: { ...emptyAdminForm },
  adminLoading: false,
  adminError: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get users");
      }

      return data as user[];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (id: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const addAdmin = createAsyncThunk(
  "users/addAdmin",
  async (newAdmin: adminForm, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add admin");
      }
      return data as user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    updateAdminForm: (state, action: PayloadAction<Partial<adminForm>>) => {
      state.adminForm = { ...state.adminForm, ...action.payload };
    },
    clearAdminForm: (state) => {
      state.adminForm = { ...emptyAdminForm };
      state.adminError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(addAdmin.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.users.push(action.payload);
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload as string;
      });
  },
});
export const { updateAdminForm, clearAdminForm } = userSlice.actions;
export default userSlice.reducer;