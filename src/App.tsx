/** @jsxImportSource @emotion/react */
import { Global } from "@emotion/react";
import { AccountCircleRounded } from "@material-ui/icons";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from "carbon-components-react";
import React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { useRecoilState, useRecoilValue } from "recoil";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LoginModalState } from "./components/LoginModal";
import { AccessTokenState, IsLoggedIn, loginState, logout } from "./lib/auth";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";

function App() {
    const [, setLoginModalOpen] = useRecoilState(LoginModalState);
    const [, setToken] = useRecoilState(AccessTokenState);
    const loggedIn = useRecoilValue(IsLoggedIn);

    useEffectOnce(() => {
        if (loggedIn === loginState.NotLoggedIn) {
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
            <Global
                styles={{
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
                }}
            />
            <Header aria-label="Header">
                <Link to="/" css={{ textDecoration: "none" }}>
                    <HeaderName prefix="">Classman</HeaderName>
                </Link>
                <HeaderGlobalBar>
                    {/* <Link to="/login"> */}
                    {loggedIn === loginState.NotLoggedIn && (
                        <HeaderGlobalAction
                            tooltipAlignment="end"
                            aria-label="Login"
                            onClick={() => setLoginModalOpen(true)}
                        >
                            <AccountCircleRounded />
                        </HeaderGlobalAction>
                    )}
                    {loggedIn === loginState.LoggedIn && (
                        <HeaderGlobalAction
                            tooltipAlignment="end"
                            aria-label="Logout"
                            onClick={() => {
                                setToken(null);
                                logout();
                            }}
                        >
                            <AccountCircleRounded />
                        </HeaderGlobalAction>
                    )}
                    {/* </Link> */}
                </HeaderGlobalBar>
            </Header>
            <main
                css={{
                    paddingTop: 48,
                    height: "100%",
                }}
            >
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/login" component={HomePage} />
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
