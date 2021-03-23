/** @jsxImportSource @emotion/react */
import { blue60 } from "@carbon/colors";
import { Form, Loading, Modal, TextInput } from "carbon-components-react";
import { useFormik } from "formik";
import { atom, useRecoilState } from "recoil";
import { object, SchemaOf, string } from "yup";
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
    const [, setRegistrationModalOpen] = useRecoilState(RegistrationModalState);

    const initialValues: loginFormValues = {
        email: "",
        password: "",
    };

    const validationSchema: SchemaOf<loginFormValues> = object({
        email: string().email("Must be a valid email").required("Email is required"),
        password: string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
    });

    const formik = useFormik<loginFormValues>({
        initialValues: initialValues,
        onSubmit: (values, actions) => {
            console.log({ values, actions });
            setTimeout(() => {
                actions.setSubmitting(false);
            }, 5000);
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
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} />}
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
                    invalid={!!formik.errors.email}
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
                    invalid={!!formik.errors.password && formik.touched.email}
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
                        setLoginModalOpen(false);
                        setRegistrationModalOpen(true);
                    }}
                >
                    register?
                </span>
            </p>
        </Modal>
    );
}
