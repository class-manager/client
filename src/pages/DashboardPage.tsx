/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Loading } from "carbon-components-react";
import * as React from "react";
import { useQuery } from "react-query";
import ClassCard from "../components/dashboard/ClassCard";
import TaskCard from "../components/dashboard/TaskCard";
import H1 from "../components/text/H1";
import { makeAuthenticatedRequest } from "../lib/api";

const listBackgroundStyles = css({
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
});

export function DashboardPage() {
    const classesQuery = useQuery(
        "dashboard-classes",
        async function () {
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
        },
        { refetchOnWindowFocus: false }
    );

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
            <section>
                <H1>Classes</H1>
                <div css={listBackgroundStyles}>
                    {classesQuery.data &&
                        classesQuery.data.classes.map((c) => (
                            <ClassCard key={c.id} id={c.id} name={c.name} subject={c.subject} />
                        ))}
                </div>
            </section>
            <section>
                <H1>Tasks</H1>
                <div css={listBackgroundStyles}>
                    {classesQuery.data &&
                        classesQuery.data.tasks.map((t) => (
                            <TaskCard
                                key={t.id}
                                id={t.id}
                                name={t.name}
                                classNameString={t.class}
                            />
                        ))}
                </div>
            </section>
        </div>
    );
}
