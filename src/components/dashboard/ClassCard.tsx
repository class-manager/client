/** @jsxImportSource @emotion/react */
import * as React from "react";
import BaseCard from "../cards/BaseCard";

export interface ClassCardProps {
    id: string;
    name: string;
    subject: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ id, name, subject }) => (
    <BaseCard header={subject} subHeader={name} linkTo={`/class/${id}`} />
);

export default ClassCard;
