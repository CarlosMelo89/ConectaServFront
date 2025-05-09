import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './android/app/src/screens/WelcomeScreen';
import LoginScreen from './android/app/src/screens/LoginScreen';
import RegisterScreen from './android/app/src/screens/RegisterScreen';
import ChooseProfileScreen from './android/app/src/screens/ChooseProfileScreen';
import ClienteFormScreen from './android/app/src/screens/ClienteFormScreen';
import PrestadorFormScreen from './android/app/src/screens/PrestadorFormScreen';
import HomeScreen from './android/app/src/screens/HomeScreen';

import { RootStackParamList } from './android/app/src/navigation/type';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChooseProfile" component={ChooseProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClienteForm" component={ClienteFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrestadorForm" component={PrestadorFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
