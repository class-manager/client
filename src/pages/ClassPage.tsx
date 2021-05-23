/** @jsxImportSource @emotion/react */
import { DeleteForeverRounded } from "@material-ui/icons";
import { Loading } from "carbon-components-react";
import { DateTime } from "luxon";
import * as React from "react";
import { useQuery } from "react-query";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import BaseCard from "../components/cards/BaseCard";
import NewItemCard from "../components/cards/NewItemCard";
import CreateLessonModal, { CreateLessonModalState } from "../components/modals/CreateLessonModal";
import CreateTaskModal, { CreateTaskModalState } from "../components/modals/CreateTaskModal";
import DeleteClassModal from "../components/modals/DeleteClassModal";
import RemoveStudentsModal, {
    DeleteStudentsModalState,
} from "../components/modals/RemoveStudentsModal";
import { CardSection } from "../components/scaffold/CardSection";
import H1 from "../components/text/H1";
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

    if (classesQuery.isLoading) return <Loading withOverlay />;

    if (!classesQuery.data) return <Redirect to="/dashboard" />;

    const { lessons, name, students, subject, tasks } = classesQuery.data;

    return (
        <div css={{ margin: "1rem" }}>
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
            <H1>
                {name}{" "}
                <DeleteForeverRounded
                    onClick={() => setCloseModalOpen(true)}
                    color="disabled"
                    css={{ cursor: "pointer" }}
                />
            </H1>
            <h3>{subject}</h3>
            <div
                css={{
                    display: "flex",
                    marginTop: "1rem",
                    section: {
                        marginRight: "0.5rem",
                        "&:last-of-type": { marginRight: 0 },
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
                            linkTo={`/task/${t.id}`}
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
                        <BaseCard key={s.id} header={s.name} linkTo={`/student/${s.id}`} />
                    ))}
                    <NewItemCard message="Add Student" onClick={() => {}} />
                </CardSection>
            </div>
        </div>
    );
}
