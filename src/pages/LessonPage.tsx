/** @jsxImportSource @emotion/react */
import { DeleteForeverRounded } from "@material-ui/icons";
import { Loading } from "carbon-components-react";
import { DateTime } from "luxon";
import { useState } from "react";
import { useQuery } from "react-query";
import { Redirect, useHistory, useParams } from "react-router-dom";
import BaseCard from "../components/cards/BaseCard";
import StudentPanel from "../components/lessons/StudentPanel/ContainerPanel";
import DeleteLessonModal from "../components/modals/DeleteLessonModal";
import { CardSection } from "../components/scaffold/CardSection";
import H1 from "../components/text/H1";
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

    if (lessonDetailsQuery.isLoading) return <Loading withOverlay />;

    if (!lessonDetailsQuery.data) return <Redirect to="/dashboard" />;

    const { classData, endTime, id, name, startTime, students, description } =
        lessonDetailsQuery.data;

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
            <H1>
                {name}{" "}
                <DeleteForeverRounded
                    onClick={() => setDeleteModalOpen(true)}
                    color="disabled"
                    css={{ cursor: "pointer" }}
                />
            </H1>
            <h3 css={{ cursor: "pointer" }} onClick={() => history.push(`/class/${classID}`)}>
                {classData.name}
            </h3>
            <h4>
                {DateTime.fromISO(startTime).toLocaleString(DateTime.DATETIME_MED)} -{" "}
                {DateTime.fromISO(endTime).toLocaleString(DateTime.DATETIME_MED)}
            </h4>
            <div css={{ display: "flex", height: "100%" }}>
                <section
                    css={{
                        backgroundColor: "#fff",
                        padding: "1rem",
                        flexBasis: 400,
                        marginRight: "1rem",
                    }}
                >
                    {description}
                </section>
                <CardSection header="Students">
                    {students.map((s) => (
                        <BaseCard
                            key={s.id}
                            header={s.name}
                            onClick={() => setCurrentStudent(s.id)}
                        />
                    ))}
                </CardSection>
                <StudentPanel classID={classID} lessonID={lessonID} studentID={currentStudent} />
            </div>
        </div>
    );
}
