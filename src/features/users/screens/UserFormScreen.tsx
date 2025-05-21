import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserForm } from '../components/UserForm';
import { useUserStore } from '../store/userStore';
import { CreateUserDTO } from '../types/user.types';

export const UserFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = "233";
  
  const {
    loading,
    error,
    selectedUser,
    createUser,
    updateUser,
    fetchUserById,
    setSelectedUser
  } = useUserStore();

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
    
    return () => {
      setSelectedUser(null);
    };
  }, [userId]);

  const handleSubmit = async (data: CreateUserDTO) => {
    try {
      if (userId) {
        await updateUser(userId, data);
        Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
      } else {
        await createUser(data);
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o usuário.');
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => userId ? fetchUserById(userId) : navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>
            {userId ? 'Tentar novamente' : 'Voltar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserForm
        onSubmit={handleSubmit}
        initialData={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          password: '' // Campo vazio para edição
        } : undefined}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
  },
}); 