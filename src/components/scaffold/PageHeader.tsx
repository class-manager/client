/** @jsxImportSource @emotion/react */
import { AccountCircleRounded, ExitToAppRounded } from "@material-ui/icons";
import {
    Header,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderMenuItem,
    HeaderName,
    HeaderNavigation,
} from "carbon-components-react";
import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { AccessTokenState, IsLoggedIn, loginState, logout } from "../../lib/auth";
import { LoginModalState } from "../LoginModal";

export default function PageHeader() {
    const [, setLoginModalOpen] = useRecoilState(LoginModalState);
    const [, setToken] = useRecoilState(AccessTokenState);
    const loggedIn = useRecoilValue(IsLoggedIn);
    const history = useHistory();

    return (
        <Header aria-label="Header">
            <Link to="/" css={{ textDecoration: "none" }}>
                <HeaderName prefix="">Classman</HeaderName>
            </Link>
            <HeaderNavigation>
                <HeaderMenuItem onClick={() => history.push("/students")}>Students</HeaderMenuItem>
            </HeaderNavigation>
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
                            history.push("/");
                            logout();
                        }}
                    >
                        <ExitToAppRounded />
                    </HeaderGlobalAction>
                )}
                {/* </Link> */}
            </HeaderGlobalBar>
        </Header>
    );
}
