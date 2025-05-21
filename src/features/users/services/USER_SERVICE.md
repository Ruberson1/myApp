# Documentação do Serviço de Usuários

## Visão Geral
O arquivo `userService.ts` implementa um serviço para gerenciar operações CRUD de usuários, utilizando Axios para requisições HTTP e Zod para validação de dados. É responsável por toda a comunicação com a API de usuários.

## Configuração Atual
```typescript
import { api } from '../../../services/api';
import { z } from 'zod';
import { 
  CreateUserDTO, 
  UpdateUserDTO, 
  User, 
  createUserSchema, 
  updateUserSchema, 
  userResponseSchema 
} from '../types/user.types';

export const userService = {
  list: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return z.array(userResponseSchema).parse(response.data);
  },

  create: async (userData: CreateUserDTO): Promise<User> => {
    const validatedData = createUserSchema.parse(userData);
    const response = await api.post('/users', validatedData);
    return userResponseSchema.parse(response.data);
  },

  update: async (id: string, userData: UpdateUserDTO): Promise<User> => {
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
```

## Funcionalidades Atuais
1. **Operações CRUD**
   - Listagem de usuários
   - Criação de usuário
   - Atualização de usuário
   - Exclusão de usuário
   - Busca por ID

2. **Validação de Dados**
   - Validação de criação
   - Validação de atualização
   - Validação de resposta

## Sugestões de Melhorias

### 1. Tratamento de Erros
```typescript
class UserServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

export const userService = {
  // ... operações atuais
  handleError: (error: unknown): never => {
    if (error instanceof z.ZodError) {
      throw new UserServiceError('VALIDATION_ERROR', 'Dados inválidos', error.errors);
    }
    if (error.response?.status === 404) {
      throw new UserServiceError('NOT_FOUND', 'Usuário não encontrado');
    }
    throw new UserServiceError('UNKNOWN_ERROR', 'Erro desconhecido');
  }
};
```

### 2. Cache de Requisições
```typescript
const cache = new Map<string, { data: any; timestamp: number }>();

export const userService = {
  // ... operações atuais
  getById: async (id: string): Promise<User> => {
    const cached = cache.get(id);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }

    const response = await api.get(`/users/${id}`);
    const data = userResponseSchema.parse(response.data);
    cache.set(id, { data, timestamp: Date.now() });
    return data;
  }
};
```

### 3. Retry Logic
```typescript
import axios from 'axios';

const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

export const userService = {
  list: async (): Promise<User[]> => {
    return withRetry(async () => {
      const response = await api.get('/users');
      return z.array(userResponseSchema).parse(response.data);
    });
  }
};
```

### 4. Paginação
```typescript
interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const userService = {
  // ... operações atuais
  listPaginated: async (params: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params });
    return z.object({
      data: z.array(userResponseSchema),
      total: z.number(),
      page: z.number(),
      limit: z.number()
    }).parse(response.data);
  }
};
```

### 5. Filtros e Busca
```typescript
interface UserFilters {
  search?: string;
  status?: 'active' | 'inactive';
  role?: string[];
}

export const userService = {
  // ... operações atuais
  listWithFilters: async (filters: UserFilters): Promise<User[]> => {
    const response = await api.get('/users', { params: filters });
    return z.array(userResponseSchema).parse(response.data);
  }
};
```

### 6. Upload de Arquivos
```typescript
export const userService = {
  // ... operações atuais
  uploadAvatar: async (id: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return userResponseSchema.parse(response.data);
  }
};
```

### 7. Batch Operations
```typescript
export const userService = {
  // ... operações atuais
  batchCreate: async (users: CreateUserDTO[]): Promise<User[]> => {
    const response = await api.post('/users/batch', { users });
    return z.array(userResponseSchema).parse(response.data);
  },
  
  batchDelete: async (ids: string[]): Promise<void> => {
    await api.post('/users/batch-delete', { ids });
  }
};
```

### 8. Métricas e Logging
```typescript
const logOperation = (operation: string, startTime: number) => {
  const duration = Date.now() - startTime;
  console.log(`[UserService] ${operation} completed in ${duration}ms`);
};

export const userService = {
  list: async (): Promise<User[]> => {
    const startTime = Date.now();
    try {
      const response = await api.get('/users');
      const data = z.array(userResponseSchema).parse(response.data);
      logOperation('list', startTime);
      return data;
    } catch (error) {
      logOperation('list-error', startTime);
      throw error;
    }
  }
};
```

## Boas Práticas

1. **Segurança**
   - Validação de dados
   - Sanitização de inputs
   - Tratamento de erros
   - Rate limiting

2. **Performance**
   - Cache de requisições
   - Retry logic
   - Batch operations
   - Otimização de payload

3. **Manutenibilidade**
   - Tipagem forte
   - Documentação clara
   - Testes unitários
   - Logging adequado

4. **UX**
   - Feedback de erros
   - Timeout adequado
   - Retry automático
   - Progress tracking

## Exemplo de Uso

### Operações Básicas
```typescript
// Listar usuários
const users = await userService.list();

// Criar usuário
const newUser = await userService.create({
  name: 'João Silva',
  email: 'joao@email.com'
});

// Atualizar usuário
const updatedUser = await userService.update('123', {
  name: 'João Silva Atualizado'
});

// Deletar usuário
await userService.delete('123');
```

### Uso com Filtros
```typescript
const activeUsers = await userService.listWithFilters({
  status: 'active',
  search: 'joão'
});
```

### Uso com Paginação
```typescript
const { data, total, page } = await userService.listPaginated({
  page: 1,
  limit: 10
});
```

## Considerações Finais

O serviço de usuários pode ser expandido para incluir:
- Sincronização em tempo real
- WebSocket integration
- Offline support
- Compressão de dados
- Rate limiting
- Circuit breaker
- Métricas de performance
- Analytics
- A/B testing
- Feature flags
- Internacionalização
- Versionamento de API 