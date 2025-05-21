# Documentação do Projeto

## Estrutura de Diretórios

### Diretórios Principais

1. **`src/`** - Diretório principal do código fonte
   - **`components/`** - Componentes reutilizáveis da aplicação
   - **`features/`** - Funcionalidades específicas da aplicação
   - **`navigation/`** - Configuração de navegação e rotas
   - **`services/`** - Serviços e integrações com APIs
   - **`store/`** - Gerenciamento de estado global
   - **`hooks/`** - Hooks personalizados do React
   - **`i18n/`** - Configuração de internacionalização
   - **`theme/`** - Configurações de tema e estilos
   - **`utils/`** - Funções utilitárias
   - **`constants/`** - Constantes e configurações
   - **`assets/`** - Recursos estáticos (imagens, fontes, etc.)

2. **`assets/`** - Recursos estáticos globais
3. **`.expo/`** - Configurações do Expo
4. **`node_modules/`** - Dependências do projeto

## Exemplo de Implementação de Usuários

### Estrutura de Arquivos para Usuários

```
src/
  ├── features/
  │   └── users/
  │       ├── components/
  │       │   ├── UserList.tsx
  │       │   └── UserForm.tsx
  │       ├── services/
  │       │   └── userService.ts
  │       ├── types/
  │       │   └── user.types.ts
  │       └── screens/
  │           ├── UserListScreen.tsx
  │           └── UserFormScreen.tsx
  └── services/
      └── api.ts
```

### Exemplo de Implementação

#### 1. Tipos (user.types.ts)
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}
```

#### 2. Serviço (userService.ts)
```typescript
import { api } from '@/services/api';
import { User, CreateUserDTO } from '../types/user.types';

export const userService = {
  list: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  create: async (userData: CreateUserDTO): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  }
};
```

#### 3. Tela de Listagem (UserListScreen.tsx)
```typescript
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { userService } from '../services/userService';
import { User } from '../types/user.types';

export const UserListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await userService.list();
    setUsers(data);
  };

  return (
    <View>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserListItem user={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
```

#### 4. Tela de Criação (UserFormScreen.tsx)
```typescript
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { userService } from '../services/userService';
import { CreateUserDTO } from '../types/user.types';

export const UserFormScreen = () => {
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: '',
    email: ''
  });

  const handleSubmit = async () => {
    try {
      await userService.create(formData);
      // Navegar para a lista após criar
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <View>
      <TextInput
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Nome"
      />
      <TextInput
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        placeholder="Email"
      />
      <Button title="Criar Usuário" onPress={handleSubmit} />
    </View>
  );
};
```

### Fluxo de Dados

1. **Listagem de Usuários**:
   - A tela `UserListScreen` é carregada
   - O hook `useEffect` dispara a função `loadUsers`
   - `userService.list()` faz a requisição à API
   - Os dados são armazenados no estado local
   - A lista é renderizada usando `FlatList`

2. **Criação de Usuário**:
   - O usuário acessa `UserFormScreen`
   - Preenche o formulário
   - Ao submeter, `userService.create()` é chamado
   - Após sucesso, o usuário é redirecionado para a lista

### Boas Práticas Implementadas

1. **Separação de Responsabilidades**:
   - Serviços separados da lógica de UI
   - Tipos definidos em arquivos separados
   - Componentes reutilizáveis

2. **Organização de Código**:
   - Estrutura de pastas clara e intuitiva
   - Arquivos agrupados por funcionalidade
   - Nomenclatura consistente

3. **Tipagem**:
   - Uso de TypeScript para melhor manutenção
   - Interfaces bem definidas
   - DTOs para transferência de dados

Esta documentação serve como um guia inicial para a implementação do sistema de usuários. Podemos começar a implementar o código seguindo esta estrutura. Gostaria de começar por alguma parte específica?
