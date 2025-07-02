import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/shared/Navbar";


function App() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>Hello, world!</h1>
      </div>
    </div>
  )
}
export default App;
