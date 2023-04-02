import React from "react";
import ReactDOM from "react-dom/client";
import * as config from "./config.json";

const domNode = document.getElementById("replace-me") as HTMLElement;
const root = ReactDOM.createRoot(domNode);

root.render(
  <React.StrictMode>
    <h1>Hello from react</h1>
    <p>BaseUrl: {config.apiUrl}</p>
  </React.StrictMode>
);
