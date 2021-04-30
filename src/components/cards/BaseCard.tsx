/** @jsxImportSource @emotion/react */
import { Interpolation } from "@emotion/react";
import * as React from "react";
import { useHistory } from "react-router-dom";

export interface BaseCardProps {
    header: string;
    subHeader?: string;
    linkTo?: string;
    customStyles?: Interpolation<{}>;
}

const BaseCard: React.FC<BaseCardProps> = ({ header, linkTo, subHeader, customStyles }) => {
    const history = useHistory();

    return (
        <div
            css={[
                {
                    boxSizing: "border-box",
                    marginBottom: "0.5rem",
                    margin: "0.5rem",
                    padding: "1rem",
                    // boxShadow: `0 0px 80px rgba(0, 0, 0, 0.07);`,
                    border: "1px solid lightgrey",
                    backgroundColor: "white",
                    cursor: "pointer",
                },
                customStyles,
            ]}
            onClick={linkTo ? () => history.push(linkTo) : undefined}
        >
            <h3 css={{ fontWeight: 600 }}>{header}</h3>
            {subHeader && <h5>{subHeader}</h5>}
        </div>
    );
};

export default BaseCard;
