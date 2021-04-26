/** @jsxImportSource @emotion/react */
import * as React from "react";
import { useHistory } from "react-router-dom";

export interface TaskCardProps {
    id: string;
    name: string;
    classNameString: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, name, classNameString }) => {
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
            onClick={() => history.push(`/task/${id}`)}
        >
            <h3 css={{ fontWeight: 600 }}>{name}</h3>
            <h5>{classNameString}</h5>
        </div>
    );
};

export default TaskCard;
