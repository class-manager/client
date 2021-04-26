/** @jsxImportSource @emotion/react */
import * as React from "react";
import { useParams } from "react-router-dom";
import H1 from "../components/text/H1";

export function ClassPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div css={{ margin: "1rem" }}>
            <H1>Class {id}</H1>
        </div>
    );
}
