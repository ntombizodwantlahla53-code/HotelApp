import { configureStore } from "@reduxjs/toolkit";
import registerReducer from '../components/features/regslice'
import loginReducer from '../components/features/loginslice'
import addhotelsReducer from "../components/features/hotelslice"
import roomReducer from "../components/features/roomslice";
import hotelReducer from "../components/features/hotelslice"
import bookingReducer from "../components/features/bookingslice"
import favouriteReducer from "../components/features/favourateslice"
import profileReducer from "../components/features/profileslice"
import userReducer from "../components/features/userslice"
import searchReducer from "../components/features/searchslice"



export const store = configureStore({
    reducer : {
        register : registerReducer,
        login : loginReducer,
        addhotels: addhotelsReducer,
        rooms:roomReducer,
        hotels: hotelReducer,
        booking: bookingReducer,
        favourites: favouriteReducer,
        profile: profileReducer,
        users: userReducer,
        search: searchReducer
        

    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch