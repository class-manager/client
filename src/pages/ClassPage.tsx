/** @jsxImportSource @emotion/react */
import { DeleteForeverRounded, SaveRounded } from "@material-ui/icons";
import { Loading } from "carbon-components-react";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import * as React from "react";
import { useQuery } from "react-query";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import * as Yup from "yup";
import BaseCard from "../components/cards/BaseCard";
import NewItemCard from "../components/cards/NewItemCard";
import AddStudentsModal, { AddStudentsModalState } from "../components/modals/AddStudentsModal";
import CreateLessonModal, { CreateLessonModalState } from "../components/modals/CreateLessonModal";
import CreateTaskModal, { CreateTaskModalState } from "../components/modals/CreateTaskModal";
import DeleteClassModal from "../components/modals/DeleteClassModal";
import RemoveStudentsModal, {
    DeleteStudentsModalState,
} from "../components/modals/RemoveStudentsModal";
import { CardSection } from "../components/scaffold/CardSection";
import { makeAuthenticatedRequest } from "../lib/api";

interface classPageData {
    name: string;
    subject: string;
    lessons: {
        id: string;
        name: string;
        timestamp: string;
    }[];
    students: {
        id: string;
        name: string;
    }[];
    tasks: {
        id: string;
        name: string;
        timestamp: string;
    }[];
}

interface classDetails {
    name: string;
    subject: string;
}

const validationSchema: Yup.SchemaOf<classDetails> = Yup.object({
    name: Yup.string().required(),
    subject: Yup.string().required(),
});

export function ClassPage() {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const classesQuery = useQuery(
        `classes-${id}`,
        async function () {
            const res = await makeAuthenticatedRequest("GET", `/classes/${id}`);

            if (res.status !== 200) history.replace("/dashboard");

            return (await res.json()) as classPageData;
        },
        { refetchOnWindowFocus: false }
    );
    const [closeModalOpen, setCloseModalOpen] = React.useState(false);
    const [, setCreateTaskModalOpen] = useRecoilState(CreateTaskModalState);
    const [, setCreateLessonModalOpen] = useRecoilState(CreateLessonModalState);
    const [, setDeleteStudentsModalOpen] = useRecoilState(DeleteStudentsModalState);
    const [, setAddStudentsModalOpen] = useRecoilState(AddStudentsModalState);

    const formik = useFormik<classDetails>({
        initialValues: { name: "", subject: "" },
        onSubmit: async (values) => {
            await makeAuthenticatedRequest("PATCH", `/classes/${id}`, values);
        },
        validationSchema,
    });

    const { data } = classesQuery;

    React.useMemo(() => {
        if (data) formik.setValues({ name: data.name, subject: data.subject });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classesQuery.data]);

    if (classesQuery.isLoading) return <Loading withOverlay />;

    if (!classesQuery.data) return <Redirect to="/dashboard" />;

    const { lessons, name, students, subject, tasks } = classesQuery.data;

    return (
        <div css={{ margin: "1rem" }}>
            {formik.isSubmitting && <Loading description="One moment" withOverlay={true} small />}
            <DeleteClassModal
                className={name}
                handleRequestClose={() => setCloseModalOpen(false)}
                id={id}
                open={closeModalOpen}
                subject={subject}
                studentsLength={students.length}
            />
            <CreateTaskModal classID={id} />
            <CreateLessonModal classID={id} />
            <RemoveStudentsModal classID={id} students={students} query={classesQuery} />
            <AddStudentsModal classID={id} query={classesQuery} students={students} />
            <div>
                <input
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="name"
                    placeholder="Enter class name"
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
                <DeleteForeverRounded
                    onClick={() => setCloseModalOpen(true)}
                    color="disabled"
                    css={{ cursor: "pointer" }}
                />
                <SaveRounded
                    color="disabled"
                    css={{ cursor: "pointer" }}
                    onClick={() => formik.submitForm()}
                />
            </div>
            <input
                type="text"
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="subject"
                placeholder="Enter subject name"
                css={{
                    fontWeight: 400,
                    letterSpacing: "-0.05rem",
                    marginBottom: ".25rem",
                    color: "#000",
                    height: 36,
                    fontSize: "1.75rem",
                    padding: 0,
                    border: 0,
                    "&:active": { outline: "none", backgroundColor: "lightgray" },
                    "&:focus": { outline: "none", backgroundColor: "lightgray" },
                }}
            />
            <div
                css={{
                    // backgroundColor: "lightblue",
                    height: "100%",
                    display: "grid",
                    gridTemplateRows: "1fr",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    marginTop: "1rem",
                    "& > section": {
                        margin: ".5rem",
                        padding: "1rem",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: `0 0px 10px rgba(0, 0, 0, 0.035),
                            0 0px 80px rgba(0, 0, 0, 0.07);`,
                    },
                }}
            >
                <CardSection header="Lessons">
                    {lessons.map((l) => (
                        <BaseCard
                            key={l.id}
                            header={l.name}
                            subHeader={DateTime.fromISO(l.timestamp).toLocaleString(
                                DateTime.DATETIME_MED
                            )}
                            linkTo={`/class/${id}/lesson/${l.id}`}
                        />
                    ))}
                    <NewItemCard
                        message="Create Lesson"
                        onClick={() => setCreateLessonModalOpen(true)}
                    />
                </CardSection>
                <CardSection header="Tasks">
                    {tasks.map((t) => (
                        <BaseCard
                            key={t.id}
                            header={t.name}
                            subHeader={DateTime.fromISO(t.timestamp).toLocaleString(
                                DateTime.DATETIME_MED
                            )}
                            linkTo={`/class/${id}/task/${t.id}`}
                        />
                    ))}
                    <NewItemCard
                        message="Create Task"
                        onClick={() => setCreateTaskModalOpen(true)}
                    />
                </CardSection>
                <CardSection
                    header="Students"
                    Icon={
                        students.length > 0 ? (
                            <DeleteForeverRounded
                                color="disabled"
                                css={{ cursor: "pointer" }}
                                onClick={() => setDeleteStudentsModalOpen(true)}
                            />
                        ) : undefined
                    }
                >
                    {students.map((s) => (
                        <BaseCard key={s.id} header={s.name} linkTo={`/students?id=${s.id}`} />
                    ))}
                    <NewItemCard
                        message="Add Student"
                        onClick={() => setAddStudentsModalOpen(true)}
                    />
                </CardSection>
            </div>
        </div>
    );
}
