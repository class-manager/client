/** @jsxImportSource @emotion/react */
import { Global } from "@emotion/react";
import { AccountCircleRounded } from "@material-ui/icons";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from "carbon-components-react";
import React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { useRecoilState } from "recoil";
import { HomePage, LoginModalState } from "./components/HomePage";

function App() {
    const [, setLoginModalOpen] = useRecoilState(LoginModalState);

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
                    <HeaderGlobalAction
                        tooltipAlignment="end"
                        aria-label="Login"
                        onClick={() => setLoginModalOpen(true)}
                    >
                        <AccountCircleRounded />
                    </HeaderGlobalAction>
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
