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
import StudentContainerPanel from "../components/students/StudentPanel/ContainerStudentPanel";
import { ReloadStudentsOverviewPage } from "../components/students/StudentPanel/FilledStudentPanel";
import H1 from "../components/text/H1";
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
                // backgroundColor: "lightblue",
                height: "100%",
                display: "grid",
                gridTemplateRows: "1fr",
                gridTemplateColumns: "400px 1fr",
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
            {studentsQuery.isLoading && <Loading withOverlay />}
            <section>
                <H1>Students</H1>
                <section
                    css={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {studentsQuery.data &&
                        studentsQuery.data.map((s) => (
                            <BaseCard
                                header={`${s.firstName} ${s.lastName}`}
                                subHeader={DateTime.fromISO(s.dob).toLocaleString(
                                    DateTime.DATE_MED
                                )}
                                onClick={() => setSelectedStudent(s.id)}
                            />
                        ))}
                    <NewItemCard
                        message="Create Student"
                        onClick={() => setSelectedStudent("new")}
                    />
                </section>
            </section>
            <StudentContainerPanel studentID={selectedStudent} />
        </div>
    );
}
