import {landing as Landing} from "./pages/landing/landing"
import {reg as Reg} from "./pages/reg/reg"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {log as Log} from "./pages/login/login"
import { hotel as Hotel } from "./pages/hotels/hotels";
import {room as Room} from "./pages/rooms/rooms"
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
      <Route path = "/Hotels" element={<Hotel/>}/>
      <Route path = "/Rooms" element= {<Room/>}/>
      <Route path = "/Rooms/:name" element= {<Room/>}/>
      {/* <Route path = "/addhotels" element ={<Addhotels/>}/> */}
      </Routes>
      </Router>
    </>
  )
}

export default App
