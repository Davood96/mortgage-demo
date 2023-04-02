import React from "react";
import ReactDOM from "react-dom/client";
import fetch from "node-fetch";

// Should be set by webpack
declare const API_URL: string;
const domNode = document.getElementById("replace-me") as HTMLElement;
const root = ReactDOM.createRoot(domNode);

const Component: React.FC<Record<string, never>> = () => {
  const [result, setResult] = React.useState<number | undefined>(undefined);
  const [error, setError] = React.useState("");
  const makeRequest = async (): Promise<number> => {
    const res = await fetch(API_URL, {
      method: "GET",
    });
    if (res.ok) {
      return ((await res.json()) as { result: number }).result;
    }
    return Promise.reject("GET failed");
  };

  React.useEffect(() => {
    makeRequest()
      .then((value) => setResult(value))
      .catch((err) => {
        console.error(err);
        setError("GET failed");
      });
  });

  return error !== "" ? (
    <p>{error}</p>
  ) : result !== undefined ? (
    <p>{result}</p>
  ) : (
    <></>
  );
};

root.render(
  <React.StrictMode>
    <h1>Hello from react</h1>
    <p>BaseUrl: {API_URL}</p>
    <Component />
  </React.StrictMode>
);
