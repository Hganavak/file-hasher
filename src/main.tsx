import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initStoryblok } from "@/storyblok/init";
import App from "./App.tsx";

initStoryblok();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
