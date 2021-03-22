/** @jsxImportSource @emotion/react */
import { Header, HeaderName } from "carbon-components-react";

function App() {
    return (
        <>
            <Header>
                <HeaderName prefix="">Classman</HeaderName>
            </Header>
            <main css={{ marginTop: 48 }}>
                <h1 css={{ padding: "3rem" }}>Welcome to Classman.</h1>
            </main>
        </>
    );
}

export default App;
