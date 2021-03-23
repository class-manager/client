/** @jsxImportSource @emotion/react */
import { Form, Loading, Modal, TextInput } from "carbon-components-react";
import { useFormik } from "formik";
import { atom, useRecoilState } from "recoil";
import { object, SchemaOf, string } from "yup";

interface registrationDetails {
    name: string;
    registrationEmail: string;
    registrationPassword: string;
    repeatPassword: string;
}

const initialRegistrationValues: registrationDetails = {
    registrationEmail: "",
    name: "",
    registrationPassword: "",
    repeatPassword: "",
};

export const RegistrationModalState = atom<boolean>({
    key: "registrationModalStateKey",
    default: false,
});
export const RegistrationModal = () => {
    const [registrationModalOpen, setRegistrationModalOpen] = useRecoilState(
        RegistrationModalState
    );

    const validationSchema: SchemaOf<registrationDetails> = object({
        registrationEmail: string().email("Must be a valid email").required("Email is required"),
        name: string().required("Name is required"),
        registrationPassword: string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
        repeatPassword: string()
            .test("password-match", "Passwords must match", function () {
                return this.parent.registrationPassword === this.parent.repeatPassword;
            })
            .required(),
    });

    const formik = useFormik<registrationDetails>({
        initialValues: initialRegistrationValues,
        onSubmit: (values, actions) => {
            console.log({ values, actions });
            setTimeout(() => {
                actions.setSubmitting(false);
            }, 1000);
        },
        validationSchema,
    });

    return (
        <Modal
            open={registrationModalOpen}
            modalHeading="Register"
            modalLabel="Accounts"
            primaryButtonText="Register"
            secondaryButtonText="Cancel"
            primaryButtonDisabled={!formik.isValid || formik.isSubmitting}
            onRequestClose={formik.isSubmitting ? undefined : () => setRegistrationModalOpen(false)}
            onRequestSubmit={() => formik.handleSubmit()}
            size="xs"
        >
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <Form
                id="registration-form"
                onSubmit={formik.handleSubmit}
                css={{
                    "& > div": {
                        marginBottom: "1rem",
                        "&:last-of-type": {
                            marginBottom: "inherit",
                        },
                    },
                }}
            >
                <TextInput
                    data-modal-primary-focus
                    placeholder="John"
                    autoFocus
                    id="name"
                    labelText="Name"
                    autoComplete="given-name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!formik.errors.name && formik.touched.name}
                    invalidText={formik.errors.name}
                    disabled={formik.isSubmitting}
                    form="registration-form"
                />
                <TextInput
                    placeholder="example@email.com"
                    autoFocus
                    id="registrationEmail"
                    labelText="Email"
                    type="email"
                    autoComplete="email"
                    value={formik.values.registrationEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!formik.errors.registrationEmail && formik.touched.registrationEmail}
                    invalidText={formik.errors.registrationEmail}
                    disabled={formik.isSubmitting}
                    form="registration-form"
                />
                <TextInput
                    placeholder="Password"
                    autoFocus
                    autoComplete="new-password"
                    id="registrationPassword"
                    labelText="New Password"
                    type="password"
                    value={formik.values.registrationPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                        !!formik.errors.registrationPassword && formik.touched.registrationPassword
                    }
                    invalidText={formik.errors.registrationPassword}
                    disabled={formik.isSubmitting}
                    form="registration-form"
                />
                <TextInput
                    placeholder="Password"
                    autoFocus
                    autoComplete="off"
                    id="repeatPassword"
                    labelText="New Password"
                    type="password"
                    value={formik.values.repeatPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!formik.errors.repeatPassword && formik.touched.repeatPassword}
                    invalidText={formik.errors.repeatPassword}
                    disabled={formik.isSubmitting}
                    form="registration-form"
                />
            </Form>
        </Modal>
    );
};
