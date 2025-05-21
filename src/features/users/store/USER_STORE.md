# Documentação do Store de Usuários

## Visão Geral
O arquivo `userStore.ts` implementa um gerenciamento de estado global para usuários usando Zustand. É responsável por gerenciar o estado dos usuários, incluindo listagem, criação, atualização e exclusão.

## Configuração Atual
```typescript
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
```

## Funcionalidades Atuais
1. **Estado**
   - Lista de usuários
   - Estado de carregamento
   - Gerenciamento de erros
   - Usuário selecionado

2. **Ações**
   - Atualização de usuários
   - Controle de loading
   - Gerenciamento de erros
   - Seleção de usuário

3. **Operações**
   - Listagem de usuários
   - Criação de usuário
   - Atualização de usuário
   - Exclusão de usuário
   - Busca por ID

## Sugestões de Melhorias

### 1. Persistência de Estado
```typescript
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // ... estado atual
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ users: state.users }),
    }
  )
);
```

### 2. Cache e Otimização
```typescript
interface UserState {
  // ... estado atual
  cache: {
    [key: string]: {
      data: User;
      timestamp: number;
    };
  };
  getCachedUser: (id: string) => User | null;
  invalidateCache: (id?: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // ... estado atual
  cache: {},
  
  getCachedUser: (id) => {
    const cached = get().cache[id];
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }
    return null;
  },
  
  invalidateCache: (id) => {
    if (id) {
      const { [id]: _, ...rest } = get().cache;
      set({ cache: rest });
    } else {
      set({ cache: {} });
    }
  }
}));
```

### 3. Validação de Dados
```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  // ... outros campos
});

export const useUserStore = create<UserState>((set, get) => ({
  // ... estado atual
  createUser: async (userData) => {
    try {
      const validatedData = userSchema.parse(userData);
      // ... resto da lógica
    } catch (error) {
      if (error instanceof z.ZodError) {
        set({ error: error.errors[0].message });
      }
      // ... tratamento de outros erros
    }
  }
}));
```

### 4. Middleware de Logging
```typescript
import { devtools } from 'zustand/middleware';

export const useUserStore = create(
  devtools(
    (set, get) => ({
      // ... estado atual
    }),
    {
      name: 'UserStore',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);
```

### 5. Seletores Otimizados
```typescript
export const useUserStore = create<UserState>((set, get) => ({
  // ... estado atual
}));

// Seletores
export const selectUserById = (id: string) => 
  useUserStore(state => state.users.find(user => user.id === id));

export const selectActiveUsers = () =>
  useUserStore(state => state.users.filter(user => user.active));

export const selectUserStats = () =>
  useUserStore(state => ({
    total: state.users.length,
    active: state.users.filter(u => u.active).length,
    inactive: state.users.filter(u => !u.active).length
  }));
```

### 6. Tratamento de Erros Avançado
```typescript
interface UserError extends Error {
  code: string;
  details?: any;
}

export const useUserStore = create<UserState>((set, get) => ({
  // ... estado atual
  handleError: (error: unknown) => {
    if (error instanceof UserError) {
      switch (error.code) {
        case 'USER_NOT_FOUND':
          set({ error: 'Usuário não encontrado' });
          break;
        case 'VALIDATION_ERROR':
          set({ error: error.details });
          break;
        default:
          set({ error: 'Erro desconhecido' });
      }
    } else {
      set({ error: 'Erro inesperado' });
    }
  }
}));
```

### 7. Paginação
```typescript
interface UserState {
  // ... estado atual
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // ... estado atual
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  
  setPage: (page) => set(state => ({
    pagination: { ...state.pagination, page }
  })),
  
  setLimit: (limit) => set(state => ({
    pagination: { ...state.pagination, limit, page: 1 }
  }))
}));
```

### 8. Filtros e Busca
```typescript
interface UserState {
  // ... estado atual
  filters: {
    search: string;
    status: 'active' | 'inactive' | 'all';
    role: string[];
  };
  setFilter: (key: keyof UserState['filters'], value: any) => void;
  getFilteredUsers: () => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  // ... estado atual
  filters: {
    search: '',
    status: 'all',
    role: []
  },
  
  setFilter: (key, value) => set(state => ({
    filters: { ...state.filters, [key]: value }
  })),
  
  getFilteredUsers: () => {
    const { users, filters } = get();
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      const matchesRole = filters.role.length === 0 || filters.role.includes(user.role);
      return matchesSearch && matchesStatus && matchesRole;
    });
  }
}));
```

## Boas Práticas

1. **Organização**
   - Separar estado por domínio
   - Usar tipos fortes
   - Implementar seletores
   - Documentar ações

2. **Performance**
   - Implementar cache
   - Usar memoização
   - Otimizar re-renders
   - Gerenciar paginação

3. **Manutenibilidade**
   - Tratamento de erros
   - Logging
   - Validação de dados
   - Testes unitários

4. **UX**
   - Feedback de loading
   - Tratamento de erros
   - Otimistic updates
   - Estado de fallback

## Exemplo de Uso

### Uso Básico
```typescript
function UserList() {
  const { users, loading, error, fetchUsers } = useUserStore();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <UserListComponent users={users} />;
}
```

### Uso com Seletores
```typescript
function UserProfile({ id }) {
  const user = useUserStore(state => 
    state.users.find(u => u.id === id)
  );
  
  return <UserProfileComponent user={user} />;
}
```

### Uso com Filtros
```typescript
function FilteredUserList() {
  const { filters, setFilter, getFilteredUsers } = useUserStore();
  const filteredUsers = getFilteredUsers();
  
  return (
    <>
      <SearchInput 
        value={filters.search}
        onChange={(value) => setFilter('search', value)}
      />
      <UserList users={filteredUsers} />
    </>
  );
}
```

## Considerações Finais

O store de usuários pode ser expandido para incluir:
- Sincronização em tempo real
- Offline support
- Undo/Redo
- Histórico de alterações
- Exportação de dados
- Importação em lote
- Relatórios e métricas
- Auditoria de ações
- Backup automático
- Integração com analytics 