/** @jsxImportSource @emotion/react */
import { Loading } from "carbon-components-react";
import * as React from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import NewItemCard from "../components/cards/NewItemCard";
import ClassCard from "../components/dashboard/ClassCard";
import TaskCard from "../components/dashboard/TaskCard";
import CreateClassModal, { CreateClassModalState } from "../components/modals/CreateClassModal";
import { CardSection } from "../components/scaffold/CardSection";
import { makeAuthenticatedRequest } from "../lib/api";

export function DashboardPage() {
    const [, setCreateClassModalOpen] = useRecoilState(CreateClassModalState);

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
                class: {
                    id: string;
                    name: string;
                    subject: string;
                };
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
                <NewItemCard message="Create Class" onClick={() => setCreateClassModalOpen(true)} />
            </CardSection>
            <CardSection header="Tasks">
                {classesQuery.data &&
                    classesQuery.data.tasks.map((t) => (
                        <TaskCard
                            classid={t.class.id}
                            key={t.id}
                            id={t.id}
                            name={t.name}
                            classNameString={`${t.class.name} - ${t.class.subject}`}
                        />
                    ))}
            </CardSection>
            <CreateClassModal />
        </div>
    );
}
