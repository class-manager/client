/** @jsxImportSource @emotion/react */
import { Global } from "@emotion/react";
import { AccountCircleRounded } from "@material-ui/icons";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from "carbon-components-react";
import React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";

function App() {
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
                    <Link to="/login">
                        <HeaderGlobalAction tooltipAlignment="end" aria-label="Login">
                            <AccountCircleRounded />
                        </HeaderGlobalAction>
                    </Link>
                </HeaderGlobalBar>
            </Header>
            <main
                css={{
                    paddingTop: 48,
                    height: "100%",
                }}
            >
                <Switch>
                    <Route path="/" exact>
                        <div
                            css={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
                                color: "#fff",
                            }}
                        >
                            <h1
                                css={{
                                    padding: "1rem",
                                    fontWeight: 500,
                                    fontSize: "3rem",
                                    textAlign: "center",
                                }}
                            >
                                Welcome to Classman
                            </h1>
                            <p css={{ fontSize: "1.5rem" }}>A classroom manager utility.</p>
                        </div>
                    </Route>
                    <Route path="/login">
                        <h1>This is the login screen</h1>
                    </Route>
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </main>
        </>
    );
}

export default App;
