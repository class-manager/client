/** @jsxImportSource @emotion/react */
import { DateTimePicker } from "@material-ui/pickers";
import { Button, Loading } from "carbon-components-react";
import { useFormik } from "formik";
import * as React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { makeAuthenticatedRequest } from "../../lib/api";
import { ITask, ITaskBase } from "../../pages/TaskPage";
export interface TaskPagePanelProps {
    data: ITask;
}

const validationSchema: Yup.SchemaOf<ITaskBase> = Yup.object({
    id: Yup.string().required(),
    description: Yup.string().notRequired(),
    dueDate: Yup.date().required(),
    maxMark: Yup.number().required(),
    name: Yup.string().required(),
    openDate: Yup.date().required(),
});

const TaskPagePanel: React.FC<TaskPagePanelProps> = ({ data }) => {
    const history = useHistory();

    const formik = useFormik<ITaskBase>({
        initialValues: { ...data },
        onSubmit: async (values, actions) => {
            const res = await makeAuthenticatedRequest(
                "PATCH",
                `/classes/${data.classID}/tasks/${data.id}`,
                values
            );
        },
        validationSchema,
    });

    const [dueDate, setDueDate] = useState(data.dueDate);

    React.useEffect(() => {
        formik.setFieldValue("dueDate", dueDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dueDate]);

    return (
        <section>
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <input
                type="text"
                placeholder="Enter task name"
                css={{
                    fontWeight: 600,
                    letterSpacing: "-0.05rem",
                    marginBottom: ".25rem",
                    color: "#000",
                    height: 50,
                    fontSize: 42,
                    padding: 0,
                    border: 0,
                    "&:active": { outline: "none", backgroundColor: "lightgray" },
                    "&:focus": { outline: "none", backgroundColor: "lightgray" },
                }}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
                name="name"
            />
            <Link css={{ textDecoration: "none" }} to={`/class/${data.classID}`}>
                <h4>{data.className}</h4>
            </Link>
            <div css={{ marginTop: "0.25rem" }}>
                <label htmlFor="maxMarks">Max Mark: </label>
                <input
                    css={{ border: "none", padding: 0, margin: 0 }}
                    type="number"
                    name="maxMark"
                    placeholder="required"
                    value={formik.values.maxMark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                />
            </div>
            <div css={{ marginTop: "0.5rem" }}>
                <DateTimePicker
                    autoOk
                    ampm={false}
                    value={formik.values.dueDate}
                    onChange={(d) => setDueDate(d?.toJSDate())}
                    label="Due Date"
                />
            </div>
            <div css={{ marginTop: "0.5rem" }}>
                <textarea
                    name="description"
                    css={{
                        width: "100%",
                        border: "none",
                        "&:active": { outline: "none", backgroundColor: "lightgray" },
                        "&:focus": { outline: "none", backgroundColor: "lightgray" },
                    }}
                    placeholder="No task description"
                    rows={10}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>
            <Button
                css={{ width: "100%", marginTop: "auto", maxWidth: "100%" }}
                disabled={formik.isSubmitting || !formik.isValid}
                onClick={() => formik.submitForm()}
            >
                Save Changes
            </Button>
            <Button
                css={{
                    width: "100%",
                    marginTop: "1rem",
                    maxWidth: "100%",
                    backgroundColor: "#da1e28",
                    "&:hover": {
                        backgroundColor: "#fa4d56",
                    },
                }}
                disabled={formik.isSubmitting || !formik.isValid}
                onClick={async () => {
                    await makeAuthenticatedRequest(
                        "DELETE",
                        `/classes/${data.classID}/tasks/${data.id}`
                    );
                    history.replace(`/class/${data.classID}`);
                }}
            >
                Delete Task
            </Button>
        </section>
    );
};

export default TaskPagePanel;
