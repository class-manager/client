/** @jsxImportSource @emotion/react */
import { Form, InlineNotification, Loading, Modal, TextInput } from "carbon-components-react";
import { useFormik } from "formik";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import * as Yup from "yup";
import { makeAuthenticatedRequest } from "../../lib/api";

export const CreateClassModalState = atom<boolean>({
    key: "createClassModalStateKey",
    default: false,
});

export interface CreateClassModalProps {}

interface formValues {
    name: string;
    subject: string;
}

const validationSchema: Yup.SchemaOf<formValues> = Yup.object({
    name: Yup.string().required(),
    subject: Yup.string().required(),
});

const CreateClassModal: React.FC<CreateClassModalProps> = () => {
    const initialValues: formValues = {
        name: "",
        subject: "",
    };

    const [open, setOpen] = useRecoilState(CreateClassModalState);
    const [failed, setFailed] = React.useState(false);

    const history = useHistory();

    const formik = useFormik<formValues>({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            try {
                const res = await makeAuthenticatedRequest("POST", "/classes", values);

                if (res.status !== 201) return setFailed(true);

                const data = (await res.json()) as { id: string; name: string; subject: string };

                actions.resetForm();
                setOpen(false);
                history.push(`/class/${data.id}`);
            } catch (error) {}
        },
    });

    return (
        <Modal
            open={open}
            modalLabel="Classes"
            modalHeading="Create Class"
            size="sm"
            onRequestClose={() => {
                if (!formik.isSubmitting) setOpen(false);
            }}
            preventCloseOnClickOutside={formik.isSubmitting}
            primaryButtonText="Create Class"
            primaryButtonDisabled={formik.isSubmitting || !formik.isValid}
            onRequestSubmit={() => formik.handleSubmit()}
        >
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <Form onSubmit={formik.handleSubmit}>
                {failed && (
                    <InlineNotification
                        kind="error"
                        title="Something went wrong. Please try again."
                        onCloseButtonClick={() => setFailed(false)}
                    />
                )}
                <div css={{ marginBottom: "1rem" }}>
                    <TextInput
                        data-modal-primary-focus
                        id="text-input-1"
                        labelText="Class Name"
                        placeholder="e.g. Class 1"
                        // style={{ paddingBottom: "1rem" }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        invalid={!!formik.errors.name && formik.touched.name}
                        invalidText={formik.errors.name}
                        disabled={formik.isSubmitting}
                        name="name"
                    />
                </div>
                <TextInput
                    data-modal-primary-focus
                    id="text-input-2"
                    labelText="Subject"
                    placeholder="e.g. Biology"
                    // style={{ paddingBottom: "1rem" }}
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={!!formik.errors.subject && formik.touched.subject}
                    invalidText={formik.errors.subject}
                    disabled={formik.isSubmitting}
                />
            </Form>
        </Modal>
    );
};

export default CreateClassModal;
