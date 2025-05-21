import { api } from '../../../services/api';
import { z } from 'zod';
import { CreateUserDTO, UpdateUserDTO, User, createUserSchema, updateUserSchema, userResponseSchema } from '../types/user.types';

export const userService = {
  list: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return z.array(userResponseSchema).parse(response.data);
  },

  create: async (userData: CreateUserDTO): Promise<User> => {
    // Valida os dados antes de enviar
    const validatedData = createUserSchema.parse(userData);
    const response = await api.post('/users', validatedData);
    return userResponseSchema.parse(response.data);
  },

  update: async (id: string, userData: UpdateUserDTO): Promise<User> => {
    // Valida os dados antes de enviar
    const validatedData = updateUserSchema.parse(userData);
    const response = await api.put(`/users/${id}`, validatedData);
    return userResponseSchema.parse(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return userResponseSchema.parse(response.data);
  }
}; 