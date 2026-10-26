import { configureStore } from "@reduxjs/toolkit";
import registerReducer from '../components/features/regslice'
import loginReducer from '../components/features/loginslice'
import addhotelsReducer from "../components/features/hotelslice"
import roomReducer from "../components/features/roomslice";
import hotelReducer from "../components/features/hotelslice"
import bookingReducer from "../components/features/bookingslice"



export const store = configureStore({
    reducer : {
        register : registerReducer,
        login : loginReducer,
        addhotels: addhotelsReducer,
        rooms:roomReducer,
        hotels: hotelReducer,
        booking: bookingReducer
        

    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch