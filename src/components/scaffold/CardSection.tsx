/** @jsxImportSource @emotion/react */
import { Interpolation } from "@emotion/react";
import * as React from "react";
import H2 from "../text/H2";

export interface CardSectionProps {
    header: string;
    Icon?: React.ReactNode;
    styles?: Interpolation<{}>;
}

export const CardSection: React.FC<CardSectionProps> = ({ header, children, Icon, styles }) => {
    return (
        <section
            css={[
                {
                    height: "100%",
                    minHeight: 800,
                    width: 350,
                    display: "flex",
                    flexDirection: "column",
                },
                styles,
            ]}
        >
            <H2>
                {header}
                {Icon && Icon}
            </H2>
            <div
                css={{
                    marginTop: ".5rem",
                    height: "100%",
                    backgroundColor: "#fff",
                    flexGrow: 1,
                    overflow: "scroll",
                }}
            >
                {children}
            </div>
        </section>
    );
};
