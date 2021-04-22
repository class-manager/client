import { Loading } from "carbon-components-react";
import * as React from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { IsLoggedIn, loginState } from "../../lib/auth";

export interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const loggedIn = useRecoilValue(IsLoggedIn);
    const location = useLocation();

    return (
        <Route
            render={() =>
                loggedIn === loginState.LoggedIn ? (
                    <Route {...props} />
                ) : loggedIn === loginState.NotLoggedIn ? (
                    <Redirect to={`/?to=${location.pathname}`} />
                ) : (
                    <Loading description="One moment" withOverlay={true} />
                )
            }
        />
    );
};

export default ProtectedRoute;
