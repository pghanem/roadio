import styled from "@emotion/native";

export const Container = styled.View`
    flex: 1;
    align-items: center;
    padding: 24px;
    background-color: #ffffff;
`;

export const Main = styled.View`
    flex: 1;
    justify-content: center;
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
`;

export const Title = styled.Text`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 16px;
`;

export const Subtitle = styled.Text`
    font-size: 24px;
    color: #38434d;
    margin-bottom: 8px;
`;

export const LoginButton = styled.TouchableOpacity<{ disabled?: boolean }>`
    background-color: ${(props) => (props.disabled ? "#cccccc" : "#1DB954")};
    padding: 16px 32px;
    border-radius: 24px;
    margin-top: 24px;
    opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`;

export const LoginButtonText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
`;
