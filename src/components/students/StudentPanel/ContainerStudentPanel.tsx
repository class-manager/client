/** @jsxImportSource @emotion/react */
import * as React from "react";
import H1 from "../../text/H1";
import FilledStudentPanel from "./FilledStudentPanel";

export interface StudentPanelProps {
    studentID?: string;
}

const StudentContainerPanel: React.FC<StudentPanelProps> = ({ studentID }) => {
    // We will have 2 internal components so that we can display one when there
    // is a student ID provided.

    return (
        <section>
            <H1>Student Details</H1>
            {studentID && <FilledStudentPanel studentID={studentID} />}
            {!studentID && (
                <div>
                    <h3 css={{ margin: "1rem" }}>No student selected</h3>
                </div>
            )}
        </section>
    );
};

export default StudentContainerPanel;
