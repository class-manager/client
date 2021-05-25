/** @jsxImportSource @emotion/react */
import { DateTimePicker } from "@material-ui/pickers";
import { Button, Loading } from "carbon-components-react";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Redirect, useHistory, useParams } from "react-router-dom";
import BaseCard from "../components/cards/BaseCard";
import StudentPanel from "../components/lessons/StudentPanel/ContainerPanel";
import {
    createLessonValidationSchema,
    ILessonFormValues,
} from "../components/modals/CreateLessonModal";
import DeleteLessonModal from "../components/modals/DeleteLessonModal";
import H2 from "../components/text/H2";
import { makeAuthenticatedRequest } from "../lib/api";

interface lessonPageData {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    description: string;

    classData: {
        id: string;
        name: string;
    };
    students: { id: string; name: string }[];
}

export function LessonPage() {
    const { classID, lessonID } = useParams<{ classID: string; lessonID: string }>();
    const history = useHistory();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const lessonDetailsQuery = useQuery("lessons-page", async function () {
        const res = await makeAuthenticatedRequest(
            "GET",
            `/classes/${classID}/lessons/${lessonID}`
        );
        if (res.status !== 200) history.replace("/dashboard");
        return (await res.json()) as lessonPageData;
    });

    const [currentStudent, setCurrentStudent] = useState<string>();
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const formik = useFormik<ILessonFormValues>({
        initialValues: {
            name: "",
            startTime: DateTime.now().toJSDate(),
            endTime: DateTime.now().plus({ days: 7 }).toJSDate(),
            description: "",
        },
        onSubmit: async (values) => {
            await makeAuthenticatedRequest(
                "PATCH",
                `/classes/${classID}/lessons/${lessonID}`,
                values
            );
        },
        validationSchema: createLessonValidationSchema,
    });

    const { data } = lessonDetailsQuery;

    useEffect(() => {
        formik.setFieldValue("startTime", startTime);
        formik.setFieldValue("endTime", endTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime, endTime]);
    useMemo(() => {
        if (data) {
            formik.setValues({
                name: data.name,
                description: data.description,
                endTime: new Date(data.endTime),
                startTime: new Date(data.startTime),
            });

            setStartTime(new Date(data.startTime));
            setEndTime(new Date(data.endTime));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (lessonDetailsQuery.isLoading) return <Loading withOverlay />;

    if (!lessonDetailsQuery.data) return <Redirect to="/dashboard" />;

    const { classData, id, name, students, description } = lessonDetailsQuery.data;

    return (
        <div css={{ margin: "1rem", height: "100%", maxHeight: 750 }}>
            <DeleteLessonModal
                lessonID={lessonID}
                classID={classID}
                className={classData.name}
                lessonName={name}
                open={deleteModalOpen}
                handleRequestClose={() => setDeleteModalOpen(false)}
            />
            <div>
                <input
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="name"
                    placeholder="Enter lesson name"
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
                />{" "}
            </div>
            <h3 css={{ cursor: "pointer" }} onClick={() => history.push(`/class/${classID}`)}>
                {classData.name}
            </h3>
            <h4>
                <DateTimePicker
                    autoOk
                    ampm={false}
                    value={formik.values.startTime}
                    name="startTime"
                    onChange={(e) => setStartTime(e!.toJSDate())}
                    label="Start Time"
                />
                {"   "}
                <DateTimePicker
                    autoOk
                    ampm={false}
                    minDate={startTime}
                    value={formik.values.endTime}
                    name="endTime"
                    onChange={(e) => setEndTime(e!.toJSDate())}
                    error={!!formik.errors.endTime}
                    label="End Time"
                />
            </h4>
            <div
                css={{
                    // backgroundColor: "lightblue",
                    height: "100%",
                    display: "grid",
                    gridTemplateRows: "1fr",
                    gridTemplateColumns: "400px 1fr 1fr",
                    "& > section": {
                        margin: "1rem",
                        padding: "1rem",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: `0 0px 10px rgba(0, 0, 0, 0.035),
                                0 0px 80px rgba(0, 0, 0, 0.07);`,
                    },
                }}
            >
                <section
                    css={{
                        backgroundColor: "#fff",
                        padding: "1rem",
                        flexBasis: 400,
                    }}
                >
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
                    <Button
                        onClick={() => formik.submitForm()}
                        css={{ width: "100%", minWidth: "100%", marginTop: "1rem" }}
                        disabled={formik.isSubmitting || !formik.isValid}
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
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Delete Lesson
                    </Button>
                </section>
                <section>
                    <H2>Students</H2>
                    {students.map((s) => (
                        <BaseCard
                            key={s.id}
                            header={s.name}
                            onClick={() => setCurrentStudent(s.id)}
                        />
                    ))}
                </section>
                <StudentPanel classID={classID} lessonID={lessonID} studentID={currentStudent} />
            </div>
        </div>
    );
}
