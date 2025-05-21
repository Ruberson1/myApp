import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components/native';
import { Alert } from 'react-native';

type FormData = {
  email: string;
  password: string;
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
`;

const Input = styled.TextInput`
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 16px;
`;

const Button = styled.TouchableOpacity`
  height: 50px;
  background-color: #0066cc;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    Alert.alert('Login', `Email: ${data.email}\nSenha: ${data.password}`);
  };

  return (
    <Container>
      <Controller
        control={control}
        name="email"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Senha"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>Entrar</ButtonText>
      </Button>
    </Container>
  );
}
