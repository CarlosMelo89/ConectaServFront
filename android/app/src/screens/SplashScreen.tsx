import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/type';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const usuario = await AsyncStorage.getItem('usuario');

        if (token && usuario) {
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      }
    };

    verificarToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ConectaServ</Text>
      <ActivityIndicator size="large" color="#BFFF00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: '#BFFF00',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
