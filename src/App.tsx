/// <reference types="vite-plugin-svgr/client" />
import Logo from "./logo.svg?react";
import "./App.css";
import Navbar from "./components/Navbar";
import { useCallback, useEffect, useState } from "react";
import Display from "./graphics/Display";
import { Algorithm } from "./components/constants";

function App() {
  const [algorithm, setAlgorithm] = useState(Algorithm.BINARY_SEARCH);

  return (
    <div className="App">
      <Navbar onAnimatorUpdate={setAlgorithm}></Navbar>
      <Display algorithm={algorithm}></Display>
      
      {/* <script src="./graphics/display.ts" type="module"></script>
       */}
    </div>
  );
}

export default App;
