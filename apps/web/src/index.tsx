import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Assuming you'll create an App.tsx
import "./index.css"; // Assuming you'll create a basic CSS file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
