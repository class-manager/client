/** @jsxImportSource @emotion/react */
import * as React from "react";

export interface StudentPanelProps {
    studentID?: string;
    classID: string;
    lessonID: string;
}

const StudentPanel: React.FC<StudentPanelProps> = ({ classID, lessonID, studentID }) => {
    // We will have 2 internal components so that we can display one when there
    // is a student ID provided.

    return <div css={{ backgroundColor: "#fff" }}>Student: {studentID}</div>;
};

export default StudentPanel;
