import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import MeusServicosScreen from '../screens/MeusServicosScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [ehPrestador, setEhPrestador] = useState(false);
  const [carregado, setCarregado] = useState(false); // evita render antes da checagem

  useEffect(() => {
    const verificarSeEhPrestador = async () => {
      try {
        const flag = await AsyncStorage.getItem('ehPrestador');
        setEhPrestador(flag === 'true');
      } catch (error) {
        console.error('Erro ao verificar flag de prestador:', error);
        setEhPrestador(false);
      } finally {
        setCarregado(true);
      }
    };

    verificarSeEhPrestador();
  }, []);

  if (!carregado) {
    return null; // opcional: ou uma tela de loading temporária
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'MeusServicos') {
            iconName = focused ? 'construct' : 'construct-outline';
          }

          return <Ionicons name={iconName!} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#BFFF00',
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: {
          backgroundColor: '#1B263B',
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
      {ehPrestador && (
        <Tab.Screen name="MeusServicos" component={MeusServicosScreen} />
      )}
    </Tab.Navigator>
  );
}
