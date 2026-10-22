import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface room {
  room_id?: number;
  hotel_id: number;
  description: string;
  ammenities: string;
  capacity: number;
  quantity: number;
  price: number;
  image_url:string
}

interface RoomState {
  info: room;
  rooms: room[];
  loading: boolean;
  error: string | null;
}

const emptyRoom: room = {
  hotel_id: 0,
  description: "",
  ammenities: "",
  capacity: 0,
  quantity: 0,
  price: 0,
  image_url:""
};

const initialState: RoomState = {
  info: { ...emptyRoom },
  rooms: [],
  loading: false,
  error: null,
};

export const fetchRoom = createAsyncThunk(
  "rooms/fetchRoom",
  async (hotel_id: number, thunkAPI) => {
    try {
      const response = await fetch(`/api/hotels/${hotel_id}/rooms`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get rooms");
      }

      return data as room[];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const addRooms = createAsyncThunk(
  "rooms/addRooms",
  async (newRoom: room, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRoom),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add room");
      }

      return data as room;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const roomSlice = createSlice({
  name: "rooms",
  initialState,

  reducers: {
    updateRoom: (state, action: PayloadAction<Partial<room>>) => {
      state.info = { ...state.info, ...action.payload };
    },

    clearRoom: (state) => {
      state.info = { ...emptyRoom };
    },

    clearRoomError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(addRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.rooms = [];
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateRoom, clearRoom, clearRoomError } = roomSlice.actions;

export default roomSlice.reducer;