import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Importar todas las pantallas
import HomeScreen from './Screens/HomeScreen';
import CatalogoVacantesScreen from './Screens/CatalogoVacantesScreen';
import DetalleVacanteScreen from './Screens/DetalleVacanteScreen';
import GestionCandidatoScreen from './Screens/GestionCandidatoScreen';
import RegistroCandidatoScreen from './Screens/RegistroCandidatoScreen';
import RegistroVacanteScreen from './Screens/RegistroVacanteScreen';
import AsignarPuestoScreen from './Screens/AsignarPuestoScreen';
import EstadisticasScreen from './Screens/EstadisticasScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Crear un Stack Navigator para cada tab con transiciones animadas
function CandidatoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name="GestionCandidato"
        component={GestionCandidatoScreen}
        options={{ title: 'Gestión de Candidatos' }}
      />
      <Stack.Screen
        name="RegistroCandidato"
        component={RegistroCandidatoScreen}
        options={{ title: 'Registrar Candidato' }}
      />
      <Stack.Screen
        name="AsignarPuesto"
        component={AsignarPuestoScreen}
        options={{ title: 'Asignar Puesto' }}
      />
    </Stack.Navigator>
  );
}

function VacanteStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
    >
      <Stack.Screen
        name="CatalogoVacantes"
        component={CatalogoVacantesScreen}
        options={{ title: 'Catálogo de Vacantes' }}
      />
      <Stack.Screen
        name="DetalleVacante"
        component={DetalleVacanteScreen}
        options={{ title: 'Detalle de la Vacante' }}
      />
      <Stack.Screen
        name="RegistroVacante"
        component={RegistroVacanteScreen}
        options={{ title: 'Registrar Vacante' }}
      />
    </Stack.Navigator>
  );
}

function EstadisticasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
      <Stack.Screen
        name="Estadisticas"
        component={EstadisticasScreen}
        options={{ title: 'Estadísticas' }}
      />
    </Stack.Navigator>
  );
}

// Configuración del Tab Navigator principal con transiciones personalizadas
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Candidatos') {
            iconName = 'people';
          } else if (route.name === 'Vacantes') {
            iconName = 'briefcase';
          } else if (route.name === 'Estadísticas') {
            iconName = 'bar-chart';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#f3f4f6',
          borderTopWidth: 1,
          borderTopColor: '#d1d5db',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Candidatos" component={CandidatoStack} />
      <Tab.Screen name="Vacantes" component={VacanteStack} />
      <Tab.Screen name="Estadísticas" component={EstadisticasStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        // Agregar fuentes personalizadas aquí si es necesario
      });
    };
    loadFonts();
  }, []);

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}
