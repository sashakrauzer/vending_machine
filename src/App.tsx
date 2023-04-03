import React from "react";
import Showcase from "./features/vendingMachine/Showcase";
import "./App.scss";
import Controls from "./features/vendingMachine/Controls";

function App() {
  return (
    <div className="App">
      <Showcase />
      <Controls />
    </div>
  );
}

export default App;
