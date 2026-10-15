import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Room {
    room_id: number,
    hotel_id: number,
    description: string,
    ammenities: string,
    capacity: number, 
    quantity: number,
    price: number,
    created_at: Date,
    updated_at: Date
  
}

interface RoomsState {
  rooms: Room[];
  inputDescription: string;
  inputAmmenities: string;
  inputCapacity: string;
  inputQuantity:string | number;
  addIndex: string | null;
  openIndex: string | null;
  loading: boolean;
  error: string | null;
  sortBy: "az"| "za"| "newest" | "oldest";

}

const initialState: RoomsState = {
  rooms: [],
  inputDescription: "",
  inputAmmenities: "",
  inputCapacity: "",
  inputQuantity:1,
  addIndex: null,
  openIndex: null,
  loading: false,
  error: null,
  sortBy:"newest",
};
export const fetchRoom = createAsyncThunk("rooms/fetchRoom", async (room: Room) => 
  {
  const response = await fetch('api/rooms', {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room),
  });
  if (!response.ok) throw new Error("Failed to add room");
  return await response.json();
});

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async (_user_id: number) => 
  {
  const response = await fetch('api/rooms');
  if (!response.ok) throw new Error("Failed to get rooms");
  return await response.json();
});

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setItemDescription: (state, action: PayloadAction<string>) => { 
      state.inputDescription = action.payload; 
    },
    setItemAmmenities: (state, action: PayloadAction<string>) => { 
      state.inputAmmenities = action.payload; 
    },
    setItemCapacity: (state, action: PayloadAction<string>) => { 
      state.inputCapacity = action.payload; 
    },
    setItemQuantity: (state, action: PayloadAction<string>) => { 
      state.inputQuantity = action.payload; 
    },
    toggleDropdown: (state, action: PayloadAction<string | null>) => { 
      state.openIndex = action.payload; 
    },
    setAddIndex: (state, action: PayloadAction<string | null>) => { 
      state.addIndex = action.payload; 
    },
    
    clearAddForm: (state) => { 
      state.inputDescription = "";
      state.inputAmmenities = "";
      state.inputCapacity = "";
      state.inputQuantity = 1;
      state.addIndex = null; 
    },
    setItemSortBy:(state,action: PayloadAction<"az"| "za"| "newest" | "oldest">) => {
      state.sortBy=action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
        state.inputDescription = "";
        state.inputAmmenities = "";
        state.inputCapacity = "";
        state.inputQuantity = 1;
      })
    .addCase(fetchRooms.fulfilled, (state, action) => { state.rooms = action.payload; 

    })
  },
});

export const { setItemDescription, setItemAmmenities, setItemCapacity, setItemQuantity, toggleDropdown, setAddIndex,setItemSortBy} = roomsSlice.actions;
export default roomsSlice.reducer;