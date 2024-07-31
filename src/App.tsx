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
      <Canvas/>
    </div>
  );
}

export default App;
