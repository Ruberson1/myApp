# Documentação do useAuthStore

## Visão Geral
O `useAuthStore` é uma store global de autenticação criada com Zustand, responsável por gerenciar o estado de autenticação do usuário na aplicação.

## Estrutura Atual
```typescript
type AuthState = {
  user: string | null;  // Armazena o usuário autenticado ou null
  setUser: (user: string | null) => void;  // Função para atualizar o usuário
};
```

## Funcionalidades Atuais
1. **Armazenamento do Usuário**
   - Mantém o estado do usuário autenticado
   - Pode ser `null` quando não há usuário logado
   - Pode ser uma string (provavelmente um token ou ID)

2. **Atualização do Estado**
   - Função `setUser` para atualizar o usuário
   - Permite login (setando o usuário)
   - Permite logout (setando null)

## Sugestões de Melhorias

### 1. Tipagem Mais Robusta
```typescript
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  // outros campos relevantes
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // ...
};
```

### 2. Funcionalidades Adicionais
```typescript
type AuthState = {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Ações
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  
  // Getters
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
};
```

### 3. Persistência de Dados
```typescript
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // ... estado e ações
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);
```

### 4. Interceptor de Requisições
```typescript
// Adicionar ao api.ts
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 5. Validação com Zod
```typescript
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});

type User = z.infer<typeof userSchema>;
```

## Exemplo de Uso

### Login
```typescript
const { login } = useAuthStore();

const handleLogin = async () => {
  try {
    await login(email, password);
    // Redirecionar para dashboard
  } catch (error) {
    // Tratar erro
  }
};
```

### Verificação de Autenticação
```typescript
const { isAuthenticated, user } = useAuthStore();

if (!isAuthenticated) {
  // Redirecionar para login
}

if (user?.role === 'admin') {
  // Mostrar funcionalidades administrativas
}
```

### Proteção de Rotas
```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
```

## Boas Práticas

1. **Separação de Responsabilidades**
   - Manter lógica de autenticação na store
   - Usar serviços para chamadas à API
   - Componentes apenas para UI

2. **Tratamento de Erros**
   - Implementar tratamento de erros robusto
   - Feedback visual para o usuário
   - Logs para debugging

3. **Segurança**
   - Não armazenar senhas
   - Usar HTTPS
   - Implementar refresh token
   - Sanitizar dados

4. **Performance**
   - Usar memoização quando necessário
   - Evitar re-renders desnecessários
   - Implementar cache quando apropriado

## Considerações Finais

O `useAuthStore` é uma base sólida para autenticação, mas pode ser expandido para incluir:
- Gerenciamento de permissões
- Múltiplos tipos de autenticação
- Integração com provedores OAuth
- Recuperação de senha
- Verificação em duas etapas
- Sessões simultâneas
- Logout em todas as sessões

Gostaria de implementar alguma dessas melhorias ou tem alguma outra funcionalidade em mente?
