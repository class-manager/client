/** @jsxImportSource @emotion/react */
import * as React from "react";
import { CardSection } from "../../scaffold/CardSection";
import FilledStudentPanel from "./FilledStudentPanel";

export interface StudentPanelProps {
    studentID?: string;
}

const StudentContainerPanel: React.FC<StudentPanelProps> = ({ studentID }) => {
    // We will have 2 internal components so that we can display one when there
    // is a student ID provided.

    return (
        <CardSection header="Student Details" styles={{ marginLeft: "0.5rem", width: 500 }}>
            {studentID && <FilledStudentPanel studentID={studentID} />}
            {!studentID && (
                <div>
                    <h3 css={{ margin: "1rem" }}>No student selected</h3>
                </div>
            )}
        </CardSection>
    );
};

export default StudentContainerPanel;
