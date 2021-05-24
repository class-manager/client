/** @jsxImportSource @emotion/react */
import { Loading } from "carbon-components-react";
import { DateTime } from "luxon";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import BaseCard from "../components/cards/BaseCard";
import NewItemCard from "../components/cards/NewItemCard";
import { CreateClassModalState } from "../components/modals/CreateClassModal";
import { CardSection } from "../components/scaffold/CardSection";
import StudentContainerPanel from "../components/students/StudentPanel/ContainerStudentPanel";
import { ReloadStudentsOverviewPage } from "../components/students/StudentPanel/FilledStudentPanel";
import { makeAuthenticatedRequest } from "../lib/api";
export function StudentsPage() {
    const [, setCreateClassModalOpen] = useRecoilState(CreateClassModalState);
    const [reload, setReload] = useRecoilState(ReloadStudentsOverviewPage);
    const [selectedStudent, setSelectedStudent] = useState("");
    const location = useLocation();

    const studentsQuery = useQuery("students-all", async function () {
        const res = await makeAuthenticatedRequest("GET", "/students");
        return (await res.json()) as {
            id: string;
            firstName: string;
            lastName: string;
            dob: string;
            graduatingClass: number;
            generalNote: string | null;
            studentNumber: string | null;
        }[];
    });

    useEffect(() => {
        const query = queryString.parse(location.search) as { id?: string };
        if (query.id?.length === 36) setSelectedStudent(query.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reload) {
            studentsQuery.refetch();
            setSelectedStudent("");
            setReload(false);
        }
    }, [reload, setReload, studentsQuery]);

    return (
        <div
            css={{
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                height: "100%",
                background: "#FCFCFC",
                "& > section": {
                    // maxWidth: 350,
                    // width: "100%",
                    margin: ".5rem",
                },
                flexWrap: "wrap",
            }}
        >
            {studentsQuery.isLoading && <Loading withOverlay />}
            <CardSection header="Students">
                {studentsQuery.data &&
                    studentsQuery.data.map((s) => (
                        <BaseCard
                            header={`${s.firstName} ${s.lastName}`}
                            subHeader={DateTime.fromISO(s.dob).toLocaleString(DateTime.DATE_MED)}
                            onClick={() => setSelectedStudent(s.id)}
                        />
                    ))}
                <NewItemCard message="Create Student" onClick={() => setSelectedStudent("new")} />
            </CardSection>
            <StudentContainerPanel studentID={selectedStudent} />
        </div>
    );
}
