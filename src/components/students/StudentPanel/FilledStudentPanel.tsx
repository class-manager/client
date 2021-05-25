/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { CircularProgress } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { Button, Loading } from "carbon-components-react";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import * as React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import * as Yup from "yup";
import { makeAuthenticatedRequest } from "../../../lib/api";
import ClassCard from "../../dashboard/ClassCard";

export const ReloadStudentsOverviewPage = atom<boolean>({
    default: false,
    key: "reloadStudentsOverviewPage",
});

export interface FilledStudentPanelProps {
    studentID: string;
}

interface formValues {
    firstName: string;
    lastName: string;
    dob?: Date;
    generalNote?: string;
    graduatingClass: number;
    studentNumber?: string;
}

const validationSchema: Yup.SchemaOf<formValues> = Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    generalNote: Yup.string().optional(),
    dob: Yup.date().required(),
    graduatingClass: Yup.number().required(),
    studentNumber: Yup.string().optional(),
});

const inputStyles = css({
    border: "none",
    padding: ".25rem",
    margin: 0,
    marginLeft: "-.25rem",
    width: "100%",
    "&::placeholder": {
        fontFamily: "inherit",
        fontSize: "inherit",
    },
});

const FilledStudentPanel: React.FC<FilledStudentPanelProps> = ({ studentID }) => {
    const [, setReload] = useRecoilState(ReloadStudentsOverviewPage);
    const history = useHistory();

    const loc = `/students/${studentID}`;

    const studentDataQuery = useQuery(
        `${studentID}-studentspage`,
        async function () {
            const res = await makeAuthenticatedRequest("GET", loc);

            return (await res.json()) as {
                id: string;
                firstName: string;
                lastName: string;
                dob: string;
                generalNote: string | null;
                graduatingClass: number;
                studentNumber: string | null;
                classes: { id: string; name: string; subject: string }[];
            };
        },
        { refetchOnWindowFocus: false, enabled: false }
    );

    const { isLoading, data } = studentDataQuery;

    const [dob, setDob] = React.useState(new Date());

    const formik = useFormik<formValues>({
        onSubmit: async ({
            firstName,
            lastName,
            dob,
            generalNote,
            graduatingClass,
            studentNumber,
        }) => {
            try {
                let location = loc;
                if (studentID === "new") location = "/students";
                await makeAuthenticatedRequest(studentID === "new" ? "POST" : "PATCH", location, {
                    firstName,
                    lastName,
                    dob,
                    generalNote: generalNote ? generalNote : null,
                    graduatingClass: Math.floor(graduatingClass),
                    studentNumber: studentNumber ? studentNumber : null,
                });

                setReload(true);
                studentDataQuery.refetch();
            } catch (e) {}
        },
        validationSchema,
        initialValues:
            studentID === "new"
                ? {
                      dob: new Date(),
                      firstName: "",
                      generalNote: "",
                      lastName: "",
                      graduatingClass: 2021,
                  }
                : {
                      dob: DateTime.fromISO(data?.dob ?? "2016-05-25T09:08:34.123").toJSDate(),
                      firstName: data?.firstName ?? "",
                      generalNote: data?.generalNote ?? "",
                      lastName: data?.lastName ?? "",
                      graduatingClass: data?.graduatingClass ?? 2021,
                      studentNumber: data?.studentNumber ?? "",
                  },
    });

    React.useEffect(() => {
        if (studentID !== "new") {
            formik.setValues({
                dob: DateTime.fromISO(data?.dob ?? "2016-05-25T09:08:34.123").toJSDate(),
                firstName: data?.firstName ?? "",
                generalNote: data?.generalNote ?? "",
                lastName: data?.lastName ?? "",
                graduatingClass: data?.graduatingClass ?? 2021,
                studentNumber: data?.studentNumber ?? "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    React.useEffect(() => {
        if (studentID === "new") {
            formik.setValues({
                dob: new Date(),
                firstName: "",
                generalNote: "",
                lastName: "",
                studentNumber: "",
                graduatingClass: 2021,
            });
        } else {
            studentDataQuery.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentID]);

    React.useEffect(() => {
        formik.setFieldValue("dob", dob);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dob]);

    if (isLoading && studentID !== "new") return <CircularProgress />;

    if (!data && studentID !== "new") return null;

    return (
        <div
            css={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                "& > div": { marginBottom: ".25rem", display: "flex", alignItems: "center" },
                "& > div > label": { flexBasis: 200 },
            }}
        >
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <div>
                <label htmlFor="firstName">
                    <strong>First Name:</strong>
                </label>
                <input
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="firstName"
                    css={inputStyles}
                    placeholder="enter here"
                    type="text"
                />
            </div>
            <div>
                <label htmlFor="lastName">
                    <strong>Last Name:</strong>
                </label>
                <input
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="lastName"
                    css={inputStyles}
                    placeholder="enter here"
                    type="text"
                />
            </div>
            <div>
                <label htmlFor="graduatingClass">
                    <strong>Graduating Class:</strong>
                </label>
                <input
                    value={formik.values.graduatingClass}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="graduatingClass"
                    css={inputStyles}
                    placeholder="enter here"
                    type="number"
                />
            </div>
            <div>
                <label htmlFor="studentNumber">
                    <strong>Student Number:</strong>
                </label>
                <input
                    value={formik.values.studentNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="studentNumber"
                    css={inputStyles}
                    placeholder="enter here (optional)"
                    type="text"
                />
            </div>
            <div>
                <DatePicker
                    disableFuture
                    openTo="year"
                    format="dd/MM/yyyy"
                    label="Date of birth"
                    views={["year", "month", "date"]}
                    value={formik.values.dob}
                    onChange={(e) => setDob(e!.toJSDate())}
                />
            </div>
            <section css={{ margin: 0, marginTop: ".5rem" }}>
                <h6>General Note</h6>
                <textarea
                    value={formik.values.generalNote}
                    placeholder="No general note"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="generalNote"
                    css={[inputStyles, { height: 100 }]}
                />
            </section>
            <section css={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <h3>Classes</h3>
                {data?.classes.map((c) => (
                    <ClassCard key={c.id} id={c.id} name={c.name} subject={c.subject} />
                ))}
            </section>
            <Button
                disabled={formik.isSubmitting || !formik.isValid}
                css={{ width: "100%", maxWidth: "100%" }}
                onClick={() => formik.submitForm()}
            >
                Save Changes
            </Button>
            {studentID !== "new" && (
                <Button
                    css={{
                        width: "100%",
                        maxWidth: "100%",
                        marginTop: "1rem",
                        backgroundColor: "#da1e28",
                        "&:hover": {
                            backgroundColor: "#fa4d56",
                        },
                    }}
                    disabled={formik.isSubmitting}
                    onClick={async () => {
                        // exec delete request
                        await makeAuthenticatedRequest("DELETE", loc);
                        setReload(true);
                    }}
                >
                    Delete Student
                </Button>
            )}
        </div>
    );
};

export default FilledStudentPanel;
