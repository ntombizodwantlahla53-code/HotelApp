import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface review {
  review_id: number;
  user_id: number;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

interface ReviewState {
  reviews: review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

const callApi = async (url: string, method: string, body?: object) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json",
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

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (hotel_id: number, thunkAPI) => {
    try {
      return (await callApi(`/api/hotels/${hotel_id}/reviews`, "GET")) as review[];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const saveReview = createAsyncThunk(
  "reviews/saveReview",
  async (info: { hotel_id: number; rating: number; comment: string }, thunkAPI) => {
    try {
      return await callApi(`/api/hotels/${info.hotel_id}/reviews`, "POST", {
        rating: info.rating,
        comment: info.comment,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const removeReview = createAsyncThunk(
  "reviews/removeReview",
  async (review_id: number, thunkAPI) => {
    try {
      return await callApi(`/api/reviews/${review_id}`, "DELETE");
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }
);

export const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviews = [];
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveReview.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeReview.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default reviewSlice.reducer;