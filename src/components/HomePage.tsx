/** @jsxImportSource @emotion/react */
import React from "react";
import { LoginModal } from "./LoginModal";
import { RegistrationModal } from "./RegistrationModal";

export function HomePage() {
    return (
        <>
            <RegistrationModal />
            <LoginModal />
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
        </>
    );
}
