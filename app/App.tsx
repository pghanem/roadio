import { Text, View } from "react-native";

import { Container, Main, Subtitle, Title } from "../styles/App.styles";

function App() {
    return (
        <Container>
            <Main>
                <Title>Hello World</Title>
                <Subtitle>This is the first page of your app.</Subtitle>
            </Main>
        </Container>
    );
}

export default App;
