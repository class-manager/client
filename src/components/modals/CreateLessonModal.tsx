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

export const CreateLessonModalState = atom<boolean>({
    key: "createLessonModalStateKey",
    default: false,
});

export interface CreateLessonModalProps {
    classID: string;
}

interface formValues {
    name: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
}

const validationSchema: Yup.SchemaOf<formValues> = Yup.object({
    description: Yup.string().optional(),
    startTime: Yup.date().required(),
    name: Yup.string().required(),
    endTime: Yup.date()
        .min(Yup.ref("startTime"), "End time cannot be before start time")
        .required(),
});

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ classID }) => {
    const initialValues: formValues = {
        name: "",
        startTime: DateTime.now().toJSDate(),
        endTime: DateTime.now().plus({ days: 7 }).toJSDate(),
        description: "",
    };

    const [open, setOpen] = useRecoilState(CreateLessonModalState);
    const [, setFailed] = React.useState(false);

    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());

    const history = useHistory();

    const formik = useFormik<formValues>({
        initialValues,
        validationSchema,
        onSubmit: async (values, actions) => {
            try {
                const res = await makeAuthenticatedRequest(
                    "POST",
                    `/classes/${classID}/lessons`,
                    values
                );
                if (res.status !== 201) return setFailed(true);
                const data = (await res.json()) as { id: string; name: string; class: string };
                actions.resetForm();
                setOpen(false);
                history.push(`/lesson/${data.id}`);
            } catch (error) {}
        },
    });

    React.useEffect(() => {
        formik.setFieldValue("startTime", startTime);
        formik.setFieldValue("endTime", endTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime, endTime]);

    return (
        <Modal
            open={open}
            modalLabel="Lessons"
            modalHeading="Create Lesson"
            size="sm"
            onRequestClose={() => {
                if (!formik.isSubmitting) setOpen(false);
            }}
            preventCloseOnClickOutside={formik.isSubmitting}
            primaryButtonText="Create Lesson"
            primaryButtonDisabled={formik.isSubmitting || !formik.isValid}
            onRequestSubmit={() => formik.handleSubmit()}
        >
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <Form onSubmit={formik.handleSubmit}></Form>
            <div css={{ marginBottom: "1rem" }}>
                <TextInput
                    data-modal-primary-focus
                    id="text-input-1"
                    labelText="Lesson Name"
                    placeholder="e.g. Introduction to Data Structures"
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
                    placeholder="e.g. In this lesson, we will look at..."
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
                <KeyboardDateTimePicker
                    label="Start Time"
                    value={formik.values.startTime}
                    onChange={(e) => setStartTime(e!.toJSDate())}
                    name="startTime"
                    format="yyyy/MM/dd HH:mm"
                    open={false}
                />
            </div>
            <div css={{ marginBottom: "1rem" }}>
                <KeyboardDateTimePicker
                    label="End Time"
                    minDate={startTime}
                    value={formik.values.endTime}
                    onChange={(e) => setEndTime(e!.toJSDate())}
                    name="startTime"
                    format="yyyy/MM/dd HH:mm"
                    open={false}
                    error={!!formik.errors.endTime}
                    disablePast
                />
            </div>
        </Modal>
    );
};

export default CreateLessonModal;
