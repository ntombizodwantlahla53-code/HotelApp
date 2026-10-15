import { configureStore } from "@reduxjs/toolkit";
import registerReducer from '../components/features/regslice'
import loginReducer from '../components/features/loginslice'
import addhotelsReducer from "../components/features/hotelslice";
import roomsReducer from "../components/features/roomslice";



export const store = configureStore({
    reducer : {
        register : registerReducer,
        login : loginReducer,
        addhotels: addhotelsReducer,
        rooms:roomsReducer
        

    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch