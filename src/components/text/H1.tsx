/** @jsxImportSource @emotion/react */
import { css, Interpolation } from "@emotion/react";
import * as React from "react";

export interface H1Props {
    css?: Interpolation<{}>;
}

const h1Style = css({
    fontWeight: 600,
    letterSpacing: "-0.05rem",
    marginBottom: ".25rem",
    color: "#000",
});

const H1: React.FC<H1Props> = ({ children, css }) => {
    return <h1 css={[h1Style, css]}>{children}</h1>;
};

export default H1;
