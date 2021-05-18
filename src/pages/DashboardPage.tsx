/** @jsxImportSource @emotion/react */
import { Loading } from "carbon-components-react";
import * as React from "react";
import { useQuery } from "react-query";
import ClassCard from "../components/dashboard/ClassCard";
import TaskCard from "../components/dashboard/TaskCard";
import { CardSection } from "../components/scaffold/CardSection";
import { makeAuthenticatedRequest } from "../lib/api";

export function DashboardPage() {
    const classesQuery = useQuery("dashboard-classes", async function () {
        const res = await makeAuthenticatedRequest("GET", "/dashboard");
        return (await res.json()) as {
            classes: {
                id: string;
                name: string;
                subject: string;
            }[];
            tasks: {
                id: string;
                name: string;
                class: string;
            }[];
        };
    });

    return (
        <div
            css={{
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                height: "100%",
                background: "#FCFCFC",
                section: {
                    maxWidth: 400,
                    width: "100%",
                    margin: ".5rem",
                },
                flexWrap: "wrap",
            }}
        >
            {classesQuery.isLoading && <Loading withOverlay />}
            <CardSection header="Classes">
                {classesQuery.data &&
                    classesQuery.data.classes.map((c) => (
                        <ClassCard key={c.id} id={c.id} name={c.name} subject={c.subject} />
                    ))}
            </CardSection>
            <CardSection header="Tasks">
                {classesQuery.data &&
                    classesQuery.data.tasks.map((t) => (
                        <TaskCard key={t.id} id={t.id} name={t.name} classNameString={t.class} />
                    ))}
            </CardSection>
        </div>
    );
}
