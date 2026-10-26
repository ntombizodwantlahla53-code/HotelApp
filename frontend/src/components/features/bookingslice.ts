import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface bookingroom {
    room_id: number;
    hotel_id: number;
    description: string;
    ammenities: string;
    capacity: number;
    quantity: number;
    price: number;
}

export interface bookinginfo {
    room_id: number;
    check_in: string;
    check_out: string;
    guests: number;
}

interface bookingState {
    room: bookingroom | null;
    loading: boolean;
    error: string | null;
}

const initialState: bookingState = {
    room: null,
    loading: false,
    error: null
};

export const fetchbookingroom = createAsyncThunk(
    "bookings/fetchRoom",
    async (room_id: number, thunkAPI) => {
        try {
            const response = await fetch(`/api/rooms/${room_id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not get room");
            }
            return data as bookingroom;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error instanceof Error
                    ? error.message: "Something went wrong"
            );
        }
    }
);

export const addbooking = createAsyncThunk(
    "booking/addbooking",
    async (booking: bookinginfo, thunkAPI) => {
        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(booking)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Could not make booking");
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error instanceof Error
                    ? error.message: "Something went wrong"
            );
        }
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchbookingroom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchbookingroom.fulfilled, (state, action) => {
                state.loading = false;
                state.room = action.payload;
            })
            .addCase(fetchbookingroom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addbooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addbooking.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addbooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default bookingSlice.reducer;