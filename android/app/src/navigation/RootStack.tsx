import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './type';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChooseProfileScreen from '../screens/ChooseProfileScreen';
import ClienteFormScreen from '../screens/ClienteFormScreen';
import PrestadorFormScreen from '../screens/PrestadorFormScreen';
import PrestadorDetalhesScreen from '../screens/PrestadorDetalhesScreen';
import PerfilScreen from '../screens/PerfilScreen';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChooseProfile"
        component={ChooseProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClienteForm"
        component={ClienteFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrestadorForm"
        component={PrestadorFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrestadorDetalhes"
        component={PrestadorDetalhesScreen}
        options={{ title: 'Detalhes do Prestador' }}
      />
      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
