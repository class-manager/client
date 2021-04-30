/** @jsxImportSource @emotion/react */
import { css, Interpolation } from "@emotion/react";
import * as React from "react";

export interface H2Props {
    css?: Interpolation<{}>;
}

const h2Style = css({
    fontWeight: 600,
    letterSpacing: "-0.05rem",
    marginBottom: ".25rem",
    color: "#000",
});

const H2: React.FC<H2Props> = ({ children, css }) => {
    return <h2 css={[h2Style, css]}>{children}</h2>;
};

export default H2;
