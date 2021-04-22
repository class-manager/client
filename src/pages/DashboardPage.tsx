/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as React from "react";
import H1 from "../components/text/H1";

const listBackgroundStyles = css({
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

export function DashboardPage() {
    return (
        <div
            css={{
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                height: "100%",
                background: "#FCFCFC",
                section: {
                    maxWidth: 400,
                    width: "100%",
                    margin: ".5rem",
                },
                flexWrap: "wrap",
            }}
        >
            <section>
                <H1>Classes</H1>
                <div css={listBackgroundStyles}></div>
            </section>
            <section>
                <H1>Tasks</H1>
                <div css={listBackgroundStyles}></div>
            </section>
        </div>
    );
}
