/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { useRecoilState, useRecoilValue } from "recoil";
import { domain } from ".";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LoginModalState } from "./components/LoginModal";
import PageHeader from "./components/scaffold/PageHeader";
import { AccessTokenState, IsLoggedIn, loginState } from "./lib/auth";
import { ClassPage } from "./pages/ClassPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LessonPage } from "./pages/LessonPage";
import { StudentsPage } from "./pages/StudentsPage";
import TaskPage from "./pages/TaskPage";

const globalStyles = css({
    "*": {
        boxSizing: "border-box",
    },
    html: {
        height: "100%",
    },
    body: {
        height: "100%",
        backgroundColor: "#FCFCFC",
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
                const result = await fetch(`${domain}/api/v1/auth/reauth`, {
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
                    <ProtectedRoute
                        path="/class/:classID/lesson/:lessonID"
                        component={LessonPage}
                    />
                    <ProtectedRoute path="/class/:classid/task/:taskid" component={TaskPage} />
                    <ProtectedRoute path="/class/:id" component={ClassPage} />
                    <ProtectedRoute path="/students" component={StudentsPage} />
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </main>
        </>
    );
}

export default App;
