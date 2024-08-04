/// <reference types="vite-plugin-svgr/client" />
import Logo from "./logo.svg?react";
import "./App.css";
import Canvas from "./graphics/Canvas";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <Logo className="App-logo" />
      </header> */}
      <script src="./graphics/display.ts" type="module"></script>
    </div>
  );
}

export default App;
