/** @jsxImportSource @emotion/react */
import * as React from "react";
import BaseCard from "../cards/BaseCard";

export interface TaskCardProps {
    id: string;
    classid: string;
    name: string;
    classNameString: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ classid, id, name, classNameString }) => (
    <BaseCard header={name} subHeader={classNameString} linkTo={`/class/${classid}/task/${id}`} />
);

export default TaskCard;
