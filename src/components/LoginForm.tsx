/** @jsxImportSource @emotion/react */
import { Form, TextInput } from "carbon-components-react";
import React from "react";

export function LoginForm() {
    return (
        <Form>
            <TextInput
                css={{
                    marginBottom: "1rem",
                }}
                data-modal-primary-focus
                placeholder="example@email.com"
                autoFocus
                id="email"
                labelText="Email"
            />
            <TextInput
                placeholder="Password"
                type="password"
                autoFocus
                id="password"
                labelText="Password"
            />
        </Form>
    );
}
