/** @jsxImportSource @emotion/react */
import { Global } from "@emotion/react";
import { Header, HeaderName } from "carbon-components-react";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

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
            <Header>
                <HeaderName prefix="">Classman</HeaderName>
            </Header>
            <Switch>
                <Route path="/" exact>
                    <main
                        css={{
                            paddingTop: 48,
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
                        }}
                    >
                        <h1
                            css={{
                                padding: "1rem",
                                fontWeight: 500,
                                fontSize: "3rem",
                                textAlign: "center",
                                color: "#fff",
                            }}
                        >
                            Welcome to Classman
                        </h1>
                        <p css={{ fontSize: "1.5rem" }}>A classroom manager utility.</p>
                    </main>
                </Route>
                <Route>
                    <Redirect to="/" />
                </Route>
            </Switch>
        </>
    );
}

export default App;
