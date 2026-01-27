import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { TechnicianProvider } from "./Context/TechnicianProvider";
import WindowWidthContext from "./Context/WindowWidthContext";
import { UserProvider } from "./Context/UserProvider";

const theme = createTheme({
  direction: "rtl", // 🔵 تشغيل RTL
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WindowWidthContext>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <TechnicianProvider>
                <UserProvider>
                  <App />
                </UserProvider>
              </TechnicianProvider>
            </Provider>
          </ThemeProvider>
        </CacheProvider>
      </WindowWidthContext>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
