/// <reference types="vite-plugin-svgr/client" />
import Logo from "./logo.svg?react";
import "./App.css";
import Navbar from "./components/Navbar";
import { useCallback, useState } from "react";
import Display from "./graphics/Display";

function App() {
  
  return (
    <div className="App">
      {/* <header className="App-header">
        <Logo className="App-logo" />
      </header> */}
      <Navbar></Navbar>
      <Display></Display>
      
      {/* <script src="./graphics/display.ts" type="module"></script>
       */}
    </div>
  );
}

export default App;
