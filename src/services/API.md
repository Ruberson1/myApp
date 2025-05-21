# Documentação do Serviço de API

## Visão Geral
O arquivo `api.ts` configura uma instância base do Axios para fazer requisições HTTP na aplicação. É um ponto centralizado para configuração e interceptação de todas as chamadas à API.

## Configuração Atual
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Funcionalidades Atuais
1. **Configuração Base**
   - URL base configurável via variável de ambiente
   - Fallback para localhost:3000
   - Headers padrão para JSON

## Sugestões de Melhorias

### 1. Interceptors
```typescript
// Interceptor de Requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Lógica de refresh token
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 2. Configuração de Timeout
```typescript
export const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});
```

### 3. Retry Logic
```typescript
import axiosRetry from 'axios-retry';

axiosRetry(api, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) 
      || error.response?.status === 429;
  }
});
```

### 4. Cache de Requisições
```typescript
import { setupCache } from 'axios-cache-adapter';

const cache = setupCache({
  maxAge: 15 * 60 * 1000, // 15 minutos
  exclude: { 
    query: false,
    methods: ['POST', 'PUT', 'DELETE']
  }
});

export const api = axios.create({
  adapter: cache.adapter,
  // ... outras configs
});
```

### 5. Validação de Resposta
```typescript
import { z } from 'zod';

const responseSchema = z.object({
  data: z.any(),
  status: z.number(),
  message: z.string().optional()
});

api.interceptors.response.use(
  (response) => {
    const validatedData = responseSchema.parse(response.data);
    return { ...response, data: validatedData };
  },
  (error) => Promise.reject(error)
);
```

### 6. Logging e Monitoramento
```typescript
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API Error] ${error.config?.url}`, error);
    return Promise.reject(error);
  }
);
```

### 7. Tipagem Forte
```typescript
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retry?: boolean;
}

interface ApiResponse<T = any> extends AxiosResponse {
  data: T;
}

export const api: AxiosInstance = axios.create({
  // ... configuração
});
```

### 8. Tratamento de Erros Centralizado
```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Erro na requisição';
    throw new ApiError(status, message, error.response?.data);
  }
);
```

## Boas Práticas

1. **Segurança**
   - Implementar CSRF protection
   - Sanitização de dados
   - Rate limiting
   - Validação de certificados SSL

2. **Performance**
   - Implementar cache quando apropriado
   - Compressão de dados
   - Lazy loading de recursos
   - Otimização de payload

3. **Monitoramento**
   - Logging de erros
   - Métricas de performance
   - Rastreamento de requisições
   - Alertas de falha

4. **Manutenibilidade**
   - Documentação clara
   - Testes unitários
   - Versionamento de API
   - Padrões de nomenclatura

## Exemplo de Uso

### Requisição Básica
```typescript
const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    // Tratamento de erro
  }
};
```

### Requisição com Cache
```typescript
const getUserProfile = async (id: string) => {
  const response = await api.get(`/users/${id}`, {
    cache: {
      maxAge: 5 * 60 * 1000 // 5 minutos
    }
  });
  return response.data;
};
```

### Upload de Arquivo
```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
```

## Considerações Finais

O serviço de API pode ser expandido para incluir:
- Suporte a múltiplos ambientes
- Circuit breaker para falhas
- Compressão de dados
- Streaming de dados
- WebSocket integration
- GraphQL support
- Internacionalização de mensagens de erro
- Métricas de performance 