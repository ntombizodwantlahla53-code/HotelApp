import { useState } from 'react'
import { navbar as Navbar } from './components/navbar/navbar'
import {landing as Landing} from "./pages/landing/landing"
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Landing />
    </>
  )
}

export default App
