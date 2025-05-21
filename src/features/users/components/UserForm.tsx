import React from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserDTO, createUserSchema } from '../types/user.types';

interface UserFormProps {
  onSubmit: (data: CreateUserDTO) => Promise<void>;
  initialData?: Partial<CreateUserDTO>;
  loading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  initialData,
  loading = false 
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateUserDTO>({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialData
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Nome"
            value={value}
            onChangeText={onChange}
            editable={!loading}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Senha"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            editable={!loading}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <Button 
          title="Salvar" 
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#f44336',
  },
  error: {
    color: '#f44336',
    marginBottom: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
}); 