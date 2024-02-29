import React from "react";

function ClickerGame() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Clicker Game</h1>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}