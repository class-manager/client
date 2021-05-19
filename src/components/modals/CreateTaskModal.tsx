/** @jsxImportSource @emotion/react */
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import { Form, Loading, Modal, TextArea, TextInput } from "carbon-components-react";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import * as Yup from "yup";
import { makeAuthenticatedRequest } from "../../lib/api";

export const CreateTaskModalState = atom<boolean>({
    key: "createTaskModalStateKey",
    default: false,
});

export interface CreateTaskModalProps {
    classID: string;
}

interface formValues {
    name: string;
    description?: string;
    openDate?: Date;
    dueDate?: Date;
    maxMark: number;
}

const validationSchema: Yup.SchemaOf<formValues> = Yup.object({
    description: Yup.string().optional(),
    dueDate: Yup.date().required(),
    maxMark: Yup.number().required(),
    name: Yup.string().required(),
    openDate: Yup.date().notRequired(),
});

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ classID }) => {
    const initialValues: formValues = {
        name: "",
        maxMark: 100,
        dueDate: DateTime.now().plus({ days: 7 }).toJSDate(),
        description: "",
    };

    const [open, setOpen] = useRecoilState(CreateTaskModalState);
    const [, setFailed] = React.useState(false);

    const [dueDate, setDueDate] = React.useState(new Date());

    const history = useHistory();

    const formik = useFormik<formValues>({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            try {
                const res = await makeAuthenticatedRequest(
                    "POST",
                    `/classes/${classID}/tasks`,
                    values
                );
                if (res.status !== 201) return setFailed(true);
                const data = (await res.json()) as { id: string; name: string; class: string };
                actions.resetForm();
                setOpen(false);
                history.push(`/task/${data.id}`);
            } catch (error) {}
        },
    });

    React.useEffect(() => {
        formik.setFieldValue("dueDate", dueDate);
    }, [dueDate]);

    return (
        <Modal
            open={open}
            modalLabel="Tasks"
            modalHeading="Create Task"
            size="sm"
            onRequestClose={() => {
                if (!formik.isSubmitting) setOpen(false);
            }}
            preventCloseOnClickOutside={formik.isSubmitting}
            primaryButtonText="Create Task"
            primaryButtonDisabled={formik.isSubmitting || !formik.isValid}
            onRequestSubmit={() => formik.handleSubmit()}
        >
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <Form onSubmit={formik.handleSubmit}></Form>
            <div css={{ marginBottom: "1rem" }}>
                <TextInput
                    data-modal-primary-focus
                    id="text-input-1"
                    labelText="Task Name"
                    placeholder="e.g. Reading to write"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    invalid={!!formik.errors.name && formik.touched.name}
                    invalidText={formik.errors.name}
                    disabled={formik.isSubmitting}
                    name="name"
                    required
                />
            </div>
            <div css={{ marginBottom: "1rem" }}>
                <TextArea
                    id="text-input-2"
                    labelText="Description (optional)"
                    placeholder="e.g. In this task you will have to..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    invalid={!!formik.errors.description && formik.touched.description}
                    invalidText={formik.errors.description}
                    disabled={formik.isSubmitting}
                    name="description"
                />
            </div>
            <div css={{ marginBottom: "1rem" }}>
                <TextInput
                    id="input-3"
                    labelText="Max Mark"
                    placeholder="100"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.maxMark}
                    invalid={!!formik.errors.maxMark && formik.touched.maxMark}
                    invalidText={formik.errors.maxMark}
                    disabled={formik.isSubmitting}
                    name="maxMark"
                    required
                />
            </div>
            <div css={{ marginBottom: "1rem" }}>
                <KeyboardDateTimePicker
                    label="Due Date"
                    value={formik.values.dueDate}
                    onChange={(e) => setDueDate(e!.toJSDate())}
                    name="dueDate"
                    format="yyyy/MM/dd HH:mm"
                    open={false}
                />
            </div>
        </Modal>
    );
};

export default CreateTaskModal;
