import { configureStore } from "@reduxjs/toolkit";
import registerReducer from '../components/features/regslice'
import loginReducer from '../components/features/loginslice'
import addhotelsReducer from "../components/features/hotelslice"
import roomsReducer from "../components/features/roomslice";
import hotelReducer from "../components/features/hotelslice"



export const store = configureStore({
    reducer : {
        register : registerReducer,
        login : loginReducer,
        addhotels: addhotelsReducer,
        rooms:roomsReducer,
        hotels: hotelReducer
        

    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch