import {landing as Landing} from "./pages/landing/landing"
import {reg as Reg} from "./pages/reg/reg"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {log as Log} from "./pages/login/login"
import { hotel as Hotel } from "./pages/hotels/hotels";
import {room as Room} from "./pages/rooms/rooms"
import {admin as Admin} from "./pages/admin/admin"
import {roomlist as Roomlist} from "./pages/roomlist/roomlist"
import RequireAdmin from "./components/requireadmin/requireadmin"
import {booking as Bookings} from "./pages/bookings/bookings";
import {favourite as Favourite} from "./pages/favourates/favourate"
import {profile as Profile} from "./pages/profile/profile"
import {payment as Payment} from "./pages/payment/payment"
import {paymentcallback as PaymentCallback} from "./pages/paymentcallback/paymentcallback"
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import './App.css'
// import { Addhotels } from "./components/addhotels/addhotels";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
<Router>
      <Routes>
      <Route path = "/" element={<Landing/>}/>
      <Route path = "/Register" element={<Reg/>}/>
      <Route path = "/Login" element={<Log/>}/>
      <Route path = "/Hotels" element={<RequireAdmin><Hotel/></RequireAdmin>}/>
      <Route path = "/Admin" element={<RequireAdmin><Admin/></RequireAdmin>}/>
      <Route path = "/Rooms" element= {<RequireAdmin><Room/></RequireAdmin>}/>
      <Route path = "/Rooms/:hotel_id" element= {<RequireAdmin><Room/></RequireAdmin>}/>
      <Route path = "/hotels/:hotel_id/rooms" element={<Roomlist/>}/>
      <Route path = "/Admin/hotels/:hotel_id/rooms" element={<RequireAdmin><Roomlist/></RequireAdmin>}/>
      <Route path = "/Roomlist" element= {<Roomlist/>}/>
      <Route path = "/bookings/:room_id" element= {<Bookings/>}/>
      <Route path = "/Favourites" element= {<Favourite/>}/>
      <Route path = "/Profile" element= {<Profile/>}/>
      <Route path = "/Payment/:booking_id" element= {<Payment/>}/>
      <Route path = "/PaymentCallback" element= {<PaymentCallback/>}/>
      {/* <Route path = "/addhotels" element ={<Addhotels/>}/> */}
      </Routes>
      </Router>
    </>
  )
}

export default App
