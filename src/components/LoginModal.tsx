/** @jsxImportSource @emotion/react */
import { blue60 } from "@carbon/colors";
import { Form, InlineNotification, Loading, Modal, TextInput } from "carbon-components-react";
import { useFormik } from "formik";
import queryString from "query-string";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { object, SchemaOf, string } from "yup";
import { AccessTokenState } from "../lib/auth";
import { RegistrationModalState } from "./RegistrationModal";

export const LoginModalState = atom<boolean>({
    key: "loginModalStateKey",
    default: false,
});

interface loginFormValues {
    email: string;
    password: string;
}

export function LoginModal() {
    const [loginModalOpen, setLoginModalOpen] = useRecoilState(LoginModalState);
    const [hasFailed, setHasFailed] = useState(false);
    const [, setRegistrationModalOpen] = useRecoilState(RegistrationModalState);
    const [, setToken] = useRecoilState(AccessTokenState);
    const history = useHistory();
    const location = useLocation();

    const initialValues: loginFormValues = {
        email: "",
        password: "",
    };

    const validationSchema: SchemaOf<loginFormValues> = object({
        email: string().email("Must be a valid email").required("Email is required"),
        password: string().required("Password is required"),
    });

    const formik = useFormik<loginFormValues>({
        initialValues: initialValues,
        onSubmit: async (values, actions) => {
            try {
                const result = await fetch("https://classman.xyz/api/v1/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                    }),
                    credentials: "include",
                });

                if (result.ok) {
                    const data: { token: string } = await result.json();
                    setToken(data.token);

                    // Determine if there is a continue url
                    const continueURL = queryString.parse(location.search).to as string | undefined;
                    if (continueURL) {
                        history.replace(continueURL);
                    } else {
                        history.replace("/dashboard");
                    }
                }
            } catch (error) {
            } finally {
                actions.setSubmitting(false);
                setHasFailed(true);
            }
        },
        validationSchema,
    });

    return (
        <Modal
            open={loginModalOpen}
            modalHeading="Login"
            modalLabel="Accounts"
            onRequestClose={formik.isSubmitting ? undefined : () => setLoginModalOpen(false)}
            size="xs"
            primaryButtonText="Login"
            secondaryButtonText="Cancel"
            primaryButtonDisabled={!formik.isValid || formik.isSubmitting}
            onRequestSubmit={() => formik.handleSubmit()}
        >
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <Form
                id="login-form"
                onSubmit={formik.handleSubmit}
                css={{
                    "& > div": {
                        marginBottom: "1rem",
                        // "&:last-of-type": {
                        //     marginBottom: "inherit",
                        // },
                    },
                }}
            >
                {hasFailed && (
                    <InlineNotification
                        kind="error"
                        title="Invalid credentials. Please try again."
                        onCloseButtonClick={() => setHasFailed(false)}
                    />
                )}
                <TextInput
                    data-modal-primary-focus
                    placeholder="example@email.com"
                    autoFocus
                    id="email"
                    labelText="Email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!formik.errors.email && formik.touched.email}
                    invalidText={formik.errors.email}
                    disabled={formik.isSubmitting}
                    form="login-form"
                />

                <TextInput
                    placeholder="Password"
                    type="password"
                    autoFocus
                    id="password"
                    labelText="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!formik.errors.password && formik.touched.password}
                    invalidText={formik.errors.password}
                    disabled={formik.isSubmitting}
                    form="login-form"
                />
            </Form>
            <p>
                Did you mean to{" "}
                <span
                    css={{
                        color: blue60,
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                    onClick={() => {
                        setRegistrationModalOpen(true);
                        setLoginModalOpen(false);
                    }}
                >
                    register?
                </span>
            </p>
        </Modal>
    );
}
