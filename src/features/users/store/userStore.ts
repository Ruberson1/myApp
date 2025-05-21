import { create } from 'zustand';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/user.types';
import { userService } from '../services/userService';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  
  // Actions
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedUser: (user: User | null) => void;
  
  // Thunks
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserDTO) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserDTO) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  selectedUser: null,

  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const users = await userService.list();
      set({ users, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar usuários',
        loading: false 
      });
    }
  },

  createUser: async (userData) => {
    try {
      set({ loading: true, error: null });
      const newUser = await userService.create(userData);
      set((state) => ({ 
        users: [...state.users, newUser],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar usuário',
        loading: false 
      });
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ loading: true, error: null });
      const updatedUser = await userService.update(id, userData);
      set((state) => ({
        users: state.users.map((user) => 
          user.id === id ? updatedUser : user
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar usuário',
        loading: false 
      });
    }
  },

  deleteUser: async (id) => {
    try {
      set({ loading: true, error: null });
      await userService.delete(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar usuário',
        loading: false 
      });
    }
  },

  fetchUserById: async (id) => {
    try {
      set({ loading: true, error: null });
      const user = await userService.getById(id);
      set({ selectedUser: user, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar usuário',
        loading: false 
      });
    }
  },
})); 