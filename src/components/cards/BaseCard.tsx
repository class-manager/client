/** @jsxImportSource @emotion/react */
import { Interpolation } from "@emotion/react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import CardContainer from "./CardContainer";

export interface BaseCardProps {
    header: string;
    subHeader?: string;
    linkTo?: string;
    customStyles?: Interpolation<{}>;
    onClick?: () => void;
}

const BaseCard: React.FC<BaseCardProps> = ({
    header,
    linkTo,
    subHeader,
    customStyles,
    onClick,
}) => {
    const history = useHistory();

    return (
        <CardContainer
            onClick={onClick ? onClick : linkTo ? () => history.push(linkTo) : undefined}
            customStyles={customStyles}
        >
            <h3 css={{ fontWeight: 600 }}>{header}</h3>
            {subHeader && <h5>{subHeader}</h5>}
        </CardContainer>
    );
};

export default BaseCard;
