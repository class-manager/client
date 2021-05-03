/** @jsxImportSource @emotion/react */
import { Interpolation } from "@emotion/react";
import * as React from "react";

export interface CardContainerProps {
    customStyles?: Interpolation<{}>;
    onClick?: () => void;
}

const CardContainer: React.FC<CardContainerProps> = ({ customStyles, onClick, children }) => {
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
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default CardContainer;
