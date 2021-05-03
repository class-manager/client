import * as React from "react";
import H2 from "../text/H2";
import CardContainer from "./CardContainer";

export interface NewItemCardProps {
    onClick: () => void;
    message?: string;
}

const NewItemCard: React.FC<NewItemCardProps> = ({ message, onClick }) => (
    <CardContainer onClick={onClick}>
        <H2>+ {message}</H2>
    </CardContainer>
);

export default NewItemCard;
