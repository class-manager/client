/** @jsxImportSource @emotion/react */
import * as React from "react";
import H2 from "../text/H2";

export interface CardSectionProps {
    header: string;
}

export const CardSection: React.FC<CardSectionProps> = ({ header, children }) => {
    return (
        <section
            css={{
                height: "100%",
                minHeight: 800,
                width: 350,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <H2>{header}</H2>
            <div
                css={{
                    marginTop: ".5rem",
                    height: "100%",
                    backgroundColor: "#fff",
                    flexGrow: 1,
                }}
            >
                {children}
            </div>
        </section>
    );
};
