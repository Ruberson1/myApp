# Documentação do Sistema de Navegação

## Visão Geral
O arquivo `AppNavigator.tsx` configura a navegação principal da aplicação usando o React Navigation. É responsável por definir as rotas e a estrutura de navegação do app.

## Configuração Atual
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Funcionalidades Atuais
1. **Navegação Básica**
   - Container de navegação
   - Stack Navigator
   - Tela de Login

## Sugestões de Melhorias

### 1. Tipagem de Rotas
```typescript
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
```

### 2. Autenticação e Rotas Protegidas
```typescript
function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          // Rotas públicas
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Rotas protegidas
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. Configuração de Tema
```typescript
const theme = {
  dark: false,
  colors: {
    primary: '#2196F3',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#CCCCCC',
    notification: '#FF3B30',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      {/* ... */}
    </NavigationContainer>
  );
}
```

### 4. Navegação Aninhada
```typescript
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### 5. Configuração de Headers
```typescript
<Stack.Navigator
  screenOptions={{
    headerStyle: {
      backgroundColor: '#2196F3',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
>
  <Stack.Screen 
    name="Home" 
    component={HomeScreen}
    options={{
      title: 'Início',
      headerRight: () => (
        <Button title="Info" onPress={() => alert('Info!')} />
      ),
    }}
  />
</Stack.Navigator>
```

### 6. Deep Linking
```typescript
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:id',
      Settings: 'settings',
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      {/* ... */}
    </NavigationContainer>
  );
}
```

### 7. Persistência de Estado
```typescript
const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export default function AppNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;
        setInitialState(state);
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      {/* ... */}
    </NavigationContainer>
  );
}
```

### 8. Navegação com Gestos
```typescript
<Stack.Navigator
  screenOptions={{
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    animation: 'slide_from_right',
  }}
>
  {/* ... */}
</Stack.Navigator>
```

## Boas Práticas

1. **Organização**
   - Separar rotas por módulo
   - Usar tipos para parâmetros
   - Manter configurações centralizadas
   - Documentar rotas

2. **Performance**
   - Lazy loading de telas
   - Memoização de componentes
   - Otimização de transições
   - Gerenciamento de estado

3. **UX**
   - Feedback visual
   - Animações suaves
   - Gestos intuitivos
   - Estados de loading

4. **Segurança**
   - Proteção de rotas
   - Validação de parâmetros
   - Sanitização de dados
   - Controle de acesso

## Exemplo de Uso

### Navegação Básica
```typescript
navigation.navigate('Profile', { userId: '123' });
```

### Navegação com Parâmetros
```typescript
type ProfileScreenParams = {
  userId: string;
  showDetails?: boolean;
};

function ProfileScreen({ route, navigation }) {
  const { userId, showDetails } = route.params as ProfileScreenParams;
  // ...
}
```

### Navegação com Callback
```typescript
navigation.navigate('Settings', {
  onSave: (data) => {
    // Processar dados
  }
});
```

## Considerações Finais

O sistema de navegação pode ser expandido para incluir:
- Navegação por gestos personalizada
- Animações customizadas
- Transições entre telas
- Navegação por voz
- Acessibilidade
- Internacionalização
- Temas dinâmicos
- Analytics de navegação
- Testes de integração
- Monitoramento de performance 