/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CircularProgress } from "@material-ui/core";
import { Button, Loading } from "carbon-components-react";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import * as React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import { makeAuthenticatedRequest } from "../../../lib/api";

export interface FilledStudentPanelProps {
    studentID: string;
    lessonID: string;
    classID: string;
}

interface formValues {
    behaviouralNote: string;
}

const inputStyles = css({
    border: "none",
    padding: ".25rem",
    margin: 0,
    marginLeft: "-.25rem",
    width: "100%",
    height: 100,
    "&::placeholder": {
        fontFamily: "inherit",
        fontSize: "inherit",
    },
});

const FilledStudentPanel: React.FC<FilledStudentPanelProps> = ({
    classID,
    lessonID,
    studentID,
}) => {
    const history = useHistory();

    const loc = `/classes/${classID}/lessons/${lessonID}/students/${studentID}`;

    const studentDataQuery = useQuery(
        `${lessonID}-${studentID}`,
        async function () {
            const res = await makeAuthenticatedRequest("GET", loc);

            if (res.status !== 200) history.replace("/dashboard");

            return (await res.json()) as {
                id: string;
                bhid: string | null;
                firstName: string;
                lastName: string;
                dob: string;
                generalNote: string | null;
                behaviouralNote: string | null;
            };
        },
        { refetchOnWindowFocus: false }
    );

    const { isLoading, data } = studentDataQuery;

    const [initialNote, setInitialNote] = React.useState("");

    const formik = useFormik<formValues>({
        onSubmit: async (values) => {
            try {
                await makeAuthenticatedRequest("PATCH", loc, {
                    behaviouralNote: values.behaviouralNote ? values.behaviouralNote : null,
                });

                studentDataQuery.refetch();
            } catch (e) {}
        },
        initialValues: {
            behaviouralNote: data?.behaviouralNote ?? "",
        },
    });

    React.useEffect(() => {
        setInitialNote(data?.behaviouralNote ?? "");
        formik.setValues({ behaviouralNote: data?.behaviouralNote ?? "" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (isLoading) return <CircularProgress />;

    if (!data) return null;

    return (
        <div
            css={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                "& > div": { marginBottom: "1rem" },
            }}
        >
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <div>
                <div css={{ marginBottom: ".25rem" }}>
                    <strong>Name: </strong>
                    {data.firstName} {data.lastName}
                </div>
                <div>
                    <strong>DoB:</strong>{" "}
                    {DateTime.fromISO(data.dob).toLocaleString(DateTime.DATE_MED)}
                </div>
            </div>
            <div>
                <h6>General Note</h6>
                {data.generalNote ? (
                    <span>{data.generalNote}</span>
                ) : (
                    <span css={{ color: "grey" }}>No general note</span>
                )}
            </div>
            <div>
                <h6>Behaviour Note for this Lesson</h6>
                <textarea
                    value={formik.values.behaviouralNote}
                    placeholder="No behavioural note"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="behaviouralNote"
                    css={inputStyles}
                />
            </div>
            <Button
                disabled={initialNote === formik.values.behaviouralNote || formik.isSubmitting}
                css={{ width: "100%", maxWidth: "100%" }}
                onClick={() => formik.submitForm()}
            >
                Save Changes
            </Button>
        </div>
    );
};

export default FilledStudentPanel;
