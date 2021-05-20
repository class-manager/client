/** @jsxImportSource @emotion/react */
import { DeleteForeverRounded } from "@material-ui/icons";
import { Loading } from "carbon-components-react";
import { useQuery } from "react-query";
import { Redirect, useHistory, useParams } from "react-router-dom";
import H1 from "../components/text/H1";
import { makeAuthenticatedRequest } from "../lib/api";
interface lessonPageData {
    id: string;
    name: string;
    startTime: string;
    endTime: string;

    classData: {
        id: string;
        name: string;
    };
    studentsData: { id: string; name: string }[];
}

export function LessonPage() {
    const { classID, lessonID } = useParams<{ classID: string; lessonID: string }>();
    const history = useHistory();

    const lessonDetailsQuery = useQuery("lessons-page", async function () {
        const res = await makeAuthenticatedRequest(
            "GET",
            `/classes/${classID}/lessons/${lessonID}`
        );
        if (res.status !== 200) history.replace("/dashboard");
        return (await res.json()) as lessonPageData;
    });

    if (lessonDetailsQuery.isLoading) return <Loading withOverlay />;

    if (!lessonDetailsQuery.data) return <Redirect to="/dashboard" />;

    const { classData, endTime, id, name, startTime, studentsData } = lessonDetailsQuery.data;

    return (
        <div css={{ margin: "1rem" }}>
            <H1>
                {name}{" "}
                <DeleteForeverRounded
                    onClick={() => {}}
                    color="disabled"
                    css={{ cursor: "pointer" }}
                />
            </H1>
            <h3>{classData.name}</h3>
        </div>
    );
}
