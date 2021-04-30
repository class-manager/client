/** @jsxImportSource @emotion/react */
import * as React from "react";
import BaseCard from "../cards/BaseCard";

export interface TaskCardProps {
    id: string;
    name: string;
    classNameString: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, name, classNameString }) => (
    <BaseCard header={name} subHeader={classNameString} linkTo={`/task/${id}`} />
);

export default TaskCard;
