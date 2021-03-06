import LuxonUtils from "@date-io/luxon";
import "@fontsource/inter";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.scss";
import { RecoilExternalStatePortal } from "./lib/recoilUtil";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

export const domain = "http://localhost:3001";
// export const domain = "https://classman.xyz";

// Set cacheTime to zero to always refetch on remount
const queryClient = new QueryClient({
    defaultOptions: { queries: { cacheTime: 0, refetchOnWindowFocus: false } },
});

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <RecoilExternalStatePortal />
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <MuiPickersUtilsProvider utils={LuxonUtils}>
                        <App />
                    </MuiPickersUtilsProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
