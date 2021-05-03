/** @jsxImportSource @emotion/react */
import { Loading } from "carbon-components-react";
import * as React from "react";
import { useQuery } from "react-query";
import { Redirect, useHistory, useParams } from "react-router-dom";
import BaseCard from "../components/cards/BaseCard";
import NewItemCard from "../components/cards/NewItemCard";
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

    if (classesQuery.isLoading) return <Loading withOverlay />;

    if (!classesQuery.data) return <Redirect to="/dashboard" />;

    const { lessons, name, students, subject, tasks } = classesQuery.data;

    return (
        <div css={{ margin: "1rem" }}>
            <H1>{name}</H1>
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
                            subHeader={l.timestamp}
                            linkTo={`/lesson/${l.id}`}
                        />
                    ))}
                    <NewItemCard message="Create Lesson" onClick={() => {}} />
                </CardSection>
                <CardSection header="Tasks">
                    {tasks.map((t) => (
                        <BaseCard
                            key={t.id}
                            header={t.name}
                            subHeader={t.timestamp}
                            linkTo={`/task/${t.id}`}
                        />
                    ))}
                    <NewItemCard message="Create Task" onClick={() => {}} />
                </CardSection>
                <CardSection header="Students">
                    {students.map((s) => (
                        <BaseCard key={s.id} header={s.name} linkTo={`/student/${s.id}`} />
                    ))}
                    <NewItemCard message="Add Student" onClick={() => {}} />
                </CardSection>
            </div>
        </div>
    );
}
