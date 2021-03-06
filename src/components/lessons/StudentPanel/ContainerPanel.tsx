/** @jsxImportSource @emotion/react */
import * as React from "react";
import { CardSection } from "../../scaffold/CardSection";
import FilledStudentPanel from "./FilledPanel";

export interface StudentPanelProps {
    studentID?: string;
    classID: string;
    lessonID: string;
}

const StudentPanel: React.FC<StudentPanelProps> = ({ classID, lessonID, studentID }) => {
    // We will have 2 internal components so that we can display one when there
    // is a student ID provided.

    return (
        <CardSection header="Student Details">
            {studentID && (
                <FilledStudentPanel classID={classID} lessonID={lessonID} studentID={studentID} />
            )}
            {!studentID && (
                <div>
                    <h3 css={{ margin: "1rem" }}>No student selected</h3>
                </div>
            )}
        </CardSection>
    );
};

export default StudentPanel;
