/** @jsxImportSource @emotion/react */
import * as React from "react";
import { useHistory } from "react-router-dom";

export interface ClassCardProps {
    id: string;
    name: string;
    subject: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ id, name, subject }) => {
    const history = useHistory();

    return (
        <div
            css={{
                boxSizing: "border-box",
                width: "100%",
                marginBottom: "0.5rem",
                padding: "1rem",
                // boxShadow: `0 0px 80px rgba(0, 0, 0, 0.07);`,
                border: "1px solid lightgrey",
                backgroundColor: "white",
                cursor: "pointer",
            }}
            onClick={() => history.push(`/class/${id}`)}
        >
            <h3 css={{ fontWeight: 600 }}>{subject}</h3>
            <h5>{name}</h5>
        </div>
    );
};

export default ClassCard;
