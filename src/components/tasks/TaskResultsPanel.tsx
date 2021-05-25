/** @jsxImportSource @emotion/react */
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { Button } from "carbon-components-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { makeAuthenticatedRequest } from "../../lib/api";
import { ITask, StudentResult } from "../../pages/TaskPage";

export interface TaskResultsPanelProps {
    data: ITask;
}

const TaskResultsPanel: React.FC<TaskResultsPanelProps> = ({ data }) => {
    const [studentResults, setStudentResults] = React.useState<StudentResult[]>([]);

    React.useMemo(() => {
        setStudentResults(data.studentResults);
    }, [data]);

    return (
        <section css={{ overflowY: "auto" }}>
            <TableContainer css={{ "& *": { fontFamily: "Inter !important" } }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Mark</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentResults.map((sr) => (
                            <TableRow key={sr.id}>
                                <TableCell>
                                    <Link to={`/students?id=${sr.id}`}>{sr.name}</Link>
                                </TableCell>
                                <TableCell>
                                    <input
                                        css={{
                                            outline: "none",
                                            border: "none",
                                            padding: 0,
                                            margin: 0,
                                        }}
                                        type="number"
                                        value={sr.score ?? ""}
                                        placeholder="Enter score"
                                        onChange={(v) => {
                                            let value = v.target.value;
                                            setStudentResults(
                                                studentResults.map((r) => {
                                                    if (r.id !== sr.id) return r;

                                                    if (parseFloat(value) > data.maxMark) {
                                                        value = data.maxMark.toString();
                                                    }

                                                    // This is the record we are looking for
                                                    return {
                                                        ...r,
                                                        score:
                                                            value === "" ? null : parseFloat(value),
                                                    };
                                                })
                                            );
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                css={{ width: "100%", marginTop: "auto", maxWidth: "100%" }}
                disabled={false}
                onClick={async () => {
                    await makeAuthenticatedRequest(
                        "PATCH",
                        `/classes/${data.classID}/tasks/${data.id}/scores`,
                        { scores: studentResults }
                    );
                }}
            >
                Save Changes
            </Button>
            <Button
                css={{
                    width: "100%",
                    marginTop: "1rem",
                    maxWidth: "100%",
                    backgroundColor: "#da1e28",
                    "&:hover": {
                        backgroundColor: "#fa4d56",
                    },
                }}
                onClick={() =>
                    setStudentResults(studentResults.map((r) => ({ ...r, score: null })))
                }
            >
                Clear Scores
            </Button>
        </section>
    );
};

export default TaskResultsPanel;
