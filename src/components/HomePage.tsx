/** @jsxImportSource @emotion/react */
import { Modal } from "carbon-components-react";
import React from "react";
import { atom, useRecoilState } from "recoil";
import { LoginForm } from "./LoginForm";

export const LoginModalState = atom<boolean>({
    key: "loginModalState",
    default: false,
});
export function HomePage() {
    const [loginModalOpen, setLoginModalOpen] = useRecoilState(LoginModalState);

    return (
        <>
            <Modal
                open={loginModalOpen}
                modalHeading="Login"
                modalLabel="Accounts"
                onRequestClose={() => setLoginModalOpen(false)}
                size="sm"
                primaryButtonText="Login"
                secondaryButtonText="Cancel"
            >
                <LoginForm />
            </Modal>
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
