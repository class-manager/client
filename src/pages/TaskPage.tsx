/** @jsxImportSource @emotion/react */
import { Loading } from "carbon-components-react";
import { useQuery } from "react-query";
import { Redirect, useHistory, useParams } from "react-router-dom";
import TaskPagePanel from "../components/tasks/TaskPagePanel";
import TaskResultsPanel from "../components/tasks/TaskResultsPanel";
import { makeAuthenticatedRequest } from "../lib/api";

export interface ITaskBase {
    id: string;
    name: string;
    description?: string;
    openDate?: Date;
    dueDate?: Date;
    maxMark: number;
}

export interface ITask extends ITaskBase {
    studentResults: StudentResult[];
    className: string;
    classID: string;
}

export interface StudentResult {
    id: string;
    name: string;
    score: null | number;
}

export default function TaskPage() {
    const { classid, taskid } = useParams<{ classid: string; taskid: string }>();
    const history = useHistory();

    const taskDetailsQuery = useQuery(`task-${taskid}`, async function () {
        const res = await makeAuthenticatedRequest("GET", `/classes/${classid}/tasks/${taskid}`);
        if (res.status !== 200) history.replace("/dashboard");
        return (await res.json()) as ITask;
    });

    if (taskDetailsQuery.isLoading) return <Loading withOverlay />;

    if (!taskDetailsQuery.data) return <Redirect to="/dashboard" />;

    const { data } = taskDetailsQuery;

    return (
        <div
            css={{
                // backgroundColor: "lightblue",
                height: "100%",
                display: "grid",
                gridTemplateRows: "1fr",
                gridTemplateColumns: "500px 1fr",
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
            <TaskPagePanel query={taskDetailsQuery} data={data} />
            <TaskResultsPanel data={data} />
        </div>
    );
}
