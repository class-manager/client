/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { useRecoilState, useRecoilValue } from "recoil";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LoginModalState } from "./components/LoginModal";
import PageHeader from "./components/scaffold/PageHeader";
import { AccessTokenState, IsLoggedIn, loginState } from "./lib/auth";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";

const globalStyles = css({
    "*": {
        boxSizing: "border-box",
    },
    html: {
        height: "100%",
    },
    body: {
        height: "100%",
    },
    "#root": {
        height: "100%",
        fontFamily: "Inter, sans-serif",
    },
});

function App() {
    const [, setLoginModalOpen] = useRecoilState(LoginModalState);
    const [, setToken] = useRecoilState(AccessTokenState);
    const loggedIn = useRecoilValue(IsLoggedIn);

    useEffectOnce(() => {
        if (loggedIn !== loginState.LoggedIn) {
            setLoginModalOpen(true);
        }
        async function getToken() {
            // Call the refresh endpoint to determine if there is a valid cookie
            try {
                const result = await fetch("https://classman.xyz/api/v1/auth/reauth", {
                    method: "POST",
                    credentials: "include",
                });

                if (result.ok) {
                    const data: { token: string } = await result.json();
                    setToken(data.token);
                } else {
                    setToken(null);
                }
            } catch (error) {}
        }

        getToken();
    });

    return (
        <>
            <Global styles={globalStyles} />
            <PageHeader />
            <main
                css={{
                    paddingTop: 48,
                    height: "100%",
                }}
            >
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <ProtectedRoute path="/dashboard" component={DashboardPage} />
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </main>
        </>
    );
}

export default App;
